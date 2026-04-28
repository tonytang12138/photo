const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n? Frontend server is running!`);
    console.log(`? Access your photo gallery at:`);
    console.log(`   ? http://localhost:${PORT}`);
    console.log(`   ? http://127.0.0.1:${PORT}`);
    console.log(`\n? Serving files from: ${__dirname}`);
    console.log(`\nAvailable pages:`);
    console.log(`   - Home: http://localhost:${PORT}/`);
    console.log(`   - Gallery: http://localhost:${PORT}/gallery.html`);
    console.log(`   - Admin Login: http://localhost:${PORT}/admin-login.html`);
    console.log(`   - Admin Panel: http://localhost:${PORT}/admin-panel.html`);
    console.log(`   - Welcome: http://localhost:${PORT}/welcome.html`);
});
