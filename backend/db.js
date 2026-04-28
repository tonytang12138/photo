// ?????????? - ??? SQLite ?? PostgreSQL
const sqlite3 = require('sqlite3');
const { Client } = require('pg');

class Database {
    constructor() {
        this.type = process.env.DATABASE_URL ? 'postgresql' : 'sqlite';
        this.client = null;
        this.db = null;
    }

    async connect() {
        if (this.type === 'postgresql') {
            this.client = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false
                }
            });
            await this.client.connect();
            console.log('Connected to PostgreSQL database');
            await this.initPostgreSQL();
        } else {
            this.db = new sqlite3.Database('./gallery.db');
            console.log('Connected to SQLite database');
            await this.initSQLite();
        }
    }

    async initSQLite() {
        return new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS admins (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else {
                    console.log('Admin table initialized');
                    resolve();
                }
            });
        });
    }

    async initPostgreSQL() {
        await this.client.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Admin table initialized');
    }

    async createAdmin(username, passwordHash) {
        if (this.type === 'postgresql') {
            await this.client.query(
                'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
                [username, passwordHash]
            );
        } else {
            await new Promise((resolve, reject) => {
                this.db.run(
                    'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
                    [username, passwordHash],
                    (err) => err ? reject(err) : resolve()
                );
            });
        }
    }

    async getAdmin(username) {
        if (this.type === 'postgresql') {
            const result = await this.client.query(
                'SELECT * FROM admins WHERE username = $1',
                [username]
            );
            return result.rows[0];
        } else {
            return new Promise((resolve, reject) => {
                this.db.get(
                    'SELECT * FROM admins WHERE username = ?',
                    [username],
                    (err, row) => err ? reject(err) : resolve(row)
                );
            });
        }
    }

    async close() {
        if (this.client) {
            await this.client.end();
            console.log('PostgreSQL connection closed');
        }
        if (this.db) {
            await new Promise((resolve) => {
                this.db.close(resolve);
            });
            console.log('SQLite connection closed');
        }
    }
}

module.exports = new Database();
