document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle').querySelector('input');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    // Toggle mobile menu when the hamburger menu is clicked
    menuToggle.addEventListener('change', () => {
        if (menuToggle.checked) {
            mobileMenu.classList.add('active');
        } else {
            mobileMenu.classList.remove('active');
        }
    });

    // Close menu when the close button is clicked
    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.checked = false; // Uncheck the hamburger menu
    });
});