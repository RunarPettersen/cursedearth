export function setupLoader() {
    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");

        if (loader) {
            // Add a class to trigger the CSS transition
            loader.classList.add("loader-hidden");

            // Listen for the end of the transition to remove the loader from the DOM
            loader.addEventListener("transitionend", () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            });
        } else {
            console.error('Loader element not found');
        }
    });
}