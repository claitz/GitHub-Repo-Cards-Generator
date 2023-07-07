import express from 'express';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { generateErrorSVG, generateSVG } from './utils/svgGenerator.js';
import { hasCachedData, getCachedData, updateCache, getRepoData } from './utils/dataManager.js';

const PORT = process.env.PORT || 3000;

const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || '';

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

const checkCache = async (req, res, next) => {
    const { user, repo } = req.params;
    const hasCache = await hasCachedData(user, repo);
    if (!hasCache) {
        apiLimiter(req, res, next);
    } else {
        next();
    }
};

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.use('/css', express.static(path.join(__dirname, 'static/css')));

app.use('/js', express.static(path.join(__dirname, 'static/js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(`
        window.config = {
            PUBLIC_URL: "${PUBLIC_URL}",
            googleAnalyticsID: "${GOOGLE_ANALYTICS_ID}"
        };
    `);
});

app.get('/repo/:user/:repo', checkCache, async (req, res) => {
    const { user, repo } = req.params;
    const backgroundColor = req.query.bg_color || '#fff';
    const titleColor = req.query.title_color || '#0366d6';
    const textColor =  req.query.text_color || '#333';
    const iconColor =  req.query.icon_color || '#333';

    console.log("Request color: ", backgroundColor, titleColor, textColor, iconColor);

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

