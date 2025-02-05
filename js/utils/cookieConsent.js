export const handleCookieConsent = () => {
    // Function to read cookie value by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Check if the consent cookie already exists
    const cookieConsent = getCookie('cookieConsent');
    
    if (!cookieConsent) {
        // Show the cookie consent banner if consent is not already given
        document.getElementById('cookieConsent').style.display = 'block';
    }

    // Handle the click event on the accept button
    document.getElementById('acceptCookies').addEventListener('click', function() {
        // Hide the cookie consent banner
        document.getElementById('cookieConsent').style.display = 'none';

        // Set the cookie for 1 year (365 days)
        document.cookie = "cookieConsent=true; path=/; max-age=" + 60 * 60 * 24 * 365;
    });
};