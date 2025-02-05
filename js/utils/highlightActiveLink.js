document.addEventListener('DOMContentLoaded', () => {
    // Get the current URL path and normalize it
    const currentPath = window.location.pathname.replace(/\/$/, ""); // Remove trailing slash for consistency

    // Select all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // Get the full path of the link href and normalize it
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "");

        // Check if the current path matches the link path exactly
        if (currentPath === linkPath) {
            link.classList.add('active-link'); // Add the active class
        } else {
            link.classList.remove('active-link'); // Ensure only one link has the active class
        }
    });
});
