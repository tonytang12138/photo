const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ?????????
app.use(cors({
    origin: [
        'https://cwzzz.online',
        'https://www.cwzzz.online',
        'http://localhost:8080', 
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'file://'
    ], // ?????????????
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ??????????
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ???????
app.use(routes);

// ?????????
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Photo Gallery API is running' });
});

// ??????????
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}/api/health`);
});

// ??????
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});