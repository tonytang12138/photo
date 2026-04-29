// API Configuration for cwzzz.online
// Add this script to <head> section of all HTML files:
// <script src="api-config.js"></script>

(function() {
    var hostname = window.location.hostname;
    
    if (hostname === 'cwzzz.online' || hostname === 'www.cwzzz.online') {
        // Production - Replace with your actual Railway backend URL
        window.API_BASE_URL = 'https://your-backend.up.railway.app';
        console.log('Production API:', window.API_BASE_URL);
    } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Local development
        window.API_BASE_URL = 'http://localhost:3000';
        console.log('Local API:', window.API_BASE_URL);
    } else {
        // Default fallback
        window.API_BASE_URL = 'http://localhost:3000';
        console.log('Default API:', window.API_BASE_URL);
    }
})();
