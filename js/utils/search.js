import { handleCookieConsent } from './cookieConsent.js';

document.addEventListener('DOMContentLoaded', () => {
    // Call the cookie consent handler to display the banner if needed
    handleCookieConsent();

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const query = document.getElementById('searchInput').value.toLowerCase().trim();

            if (query) {
                window.location.href = `../search-results.html?query=${encodeURIComponent(query)}`;
            }
        });
    }
});
