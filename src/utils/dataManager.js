import fetch from 'node-fetch';
import {db} from './database.js';
import dotenv from 'dotenv';

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CACHE_MINUTES = 3; // Cache time in minutes
const CACHE_TIME = CACHE_MINUTES * 60 * 1000; // Cache time in milliseconds

export async function hasCachedData(user, repo) {
    const cachedData = await getCachedData(user, repo);
    if (!cachedData) return false;

    return Date.now() - cachedData.timestamp < CACHE_TIME;
}

export async function getCachedData(user, repo) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT *
                FROM cache
                WHERE LOWER(user) = LOWER(?)
                  AND LOWER(repo_name) = LOWER(?)`, [user, repo], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (row) {
                const data = {
                    stargazers_count: row.stars,
                    forks_count: row.forks,
                    description: row.description,
                    name: row.repo_name,
                    html_url: row.html_url,
                    language: row.language
                };
                resolve({...data, timestamp: row.timestamp});
            } else {
                resolve(null);
            }
        });
    });
}

export async function updateCache(user, repo, data) {
    return new Promise((resolve, reject) => {
        db.run(`DELETE
                FROM cache
                WHERE user = ?
                  AND repo_name = ?`, [user, repo], (err) => {
            if (err) {
                return reject(err);
            }
            db.run(`INSERT INTO cache (user, repo_name, stars, forks, description, html_url, language, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?,
                            ?)`, [user, repo, data.stargazers_count, data.forks_count, data.description, data.html_url, data.language, Date.now()], (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

export async function getRepoData(user, repo) {
    const response = await fetch(`https://api.github.com/repos/${user}/${repo}`, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repository data');
    }

    return await response.json();
}