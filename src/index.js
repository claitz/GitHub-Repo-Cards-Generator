import express from 'express';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { generateErrorSVG, generateSVG, isValidColor } from './utils/svgGenerator.js';
import { hasCachedData, getCachedData, updateCache, getRepoData } from './utils/dataManager.js';

const PORT = process.env.PORT || 3000;

const API_WINDOW = process.env.API_WINDOW || 1; // Window in minutes
const API_LIMIT = process.env.API_LIMIT || 1; // Max API calls per hour

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const apiLimiter = rateLimit({
    windowMs: API_WINDOW * 60 * 1000, // API_WINDOW hours in milliseconds
    max: API_LIMIT, // limit each IP to API_LIMIT requests per windowMs
    message: "Too many requests created from this IP, please try again after " + API_WINDOW + " minutes"
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/css', express.static(path.join(__dirname, 'static/css')));

app.use('/js', express.static(path.join(__dirname, 'static/js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

const checkCache = async (req, res, next) => {
    const { user, repo } = req.params;
    const hasCache = await hasCachedData(user, repo);
    if (!hasCache) {
        apiLimiter(req, res, next);
    } else {
        next();
    }
};

app.get('/repo/:user/:repo', checkCache, async (req, res) => {
    const { user, repo } = req.params;
    const backgroundColor = isValidColor(req.query.bg_color) ? req.query.bg_color : '#fff';
    const titleColor = isValidColor(req.query.title_color) ? req.query.title_color : '#0366d6';
    const textColor = isValidColor(req.query.text_color) ? req.query.text_color : '#333';
    const iconColor = isValidColor(req.query.icon_color) ? req.query.icon_color : '#333';

    let data;
    try {
        const hasCache = await hasCachedData(user, repo);
        if (hasCache) {
            data = await getCachedData(user, repo);
        } else {
            data = await getRepoData(user, repo);
            await updateCache(data.owner.login, data.name, data);
        }
    } catch (error) {
        const svg = generateErrorSVG('Failed to fetch repository data');
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svg);
    }

    const svg = generateSVG(data, backgroundColor, titleColor, textColor, iconColor);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});

