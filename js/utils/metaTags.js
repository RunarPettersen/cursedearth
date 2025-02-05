export const updateMetaTags = (destination) => {
    document.title = `Secret Oslo - ${destination.title}`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute("content", `Explore ${destination.title}: ${destination.introduction}`);
    }
};