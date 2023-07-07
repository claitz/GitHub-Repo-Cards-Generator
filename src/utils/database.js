import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('cache.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');

  db.run(`CREATE TABLE IF NOT EXISTS cache (
    user TEXT,
    repo_name TEXT,
    stars INTEGER,
    forks INTEGER,
    description TEXT,
    html_url TEXT,
    language TEXT,
    timestamp INTEGER,
    PRIMARY KEY (user, repo_name)
  )`, (err) => {
    if (err) {
      console.log('Error creating table', err);
    }
  });
});
