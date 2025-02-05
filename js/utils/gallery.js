let currentImageIndex = 0; // Track the current image index
let imageFilenames = []; // Store the list of image filenames for navigation
let galleryPath = ''; // Store the gallery path for constructing image URLs

export const displayGalleryImages = (path, filenames) => {
    const gallery = document.getElementById('gallery');
    imageFilenames = filenames; // Store filenames for navigation
    galleryPath = path; // Store the gallery path for constructing full image URLs

    if (imageFilenames && imageFilenames.length > 0) {
        imageFilenames.forEach((filename, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = `../${galleryPath}/${filename}`; // Correctly construct the image path
            imgElement.alt = "Gallery Image";
            imgElement.className = 'gallery-image';

            // Add click event to open image in lightbox
            imgElement.addEventListener('click', () => openLightbox(index));

            gallery.appendChild(imgElement);
        });
    } else {
        gallery.innerHTML = '<p>No images available in the gallery.</p>';
    }
};

const openLightbox = (index) => {
    currentImageIndex = index;
    updateLightboxImage();
    document.getElementById('lightbox').style.display = 'flex';

    // Add keydown event listener for arrow key navigation when lightbox is open
    document.addEventListener('keydown', handleKeydown);
};

const updateLightboxImage = () => {
    const lightboxImg = document.getElementById('lightbox').querySelector('img');
    lightboxImg.src = `../${galleryPath}/${imageFilenames[currentImageIndex]}`; // Correctly construct the image path for lightbox
};

const closeLightbox = () => {
    document.getElementById('lightbox').style.display = 'none';

    // Remove keydown event listener when lightbox is closed
    document.removeEventListener('keydown', handleKeydown);
};

const showNextImage = () => {
    currentImageIndex = (currentImageIndex + 1) % imageFilenames.length;
    updateLightboxImage();
};

const showPrevImage = () => {
    currentImageIndex = (currentImageIndex - 1 + imageFilenames.length) % imageFilenames.length;
    updateLightboxImage();
};

// Handle keydown events for arrow key navigation
const handleKeydown = (event) => {
    if (event.key === 'ArrowRight') {
        showNextImage();
    } else if (event.key === 'ArrowLeft') {
        showPrevImage();
    } else if (event.key === 'Escape') {
        closeLightbox();
    }
};

// Set up event listeners for lightbox controls
document.addEventListener('DOMContentLoaded', () => {
    // Close lightbox when clicking outside the image or on the close button
    document.getElementById('lightbox').addEventListener('click', (event) => {
        if (event.target.classList.contains('close')) {
            closeLightbox();
        }
    });

    document.getElementById('next-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing lightbox
        showNextImage();
    });

    document.getElementById('prev-btn').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from closing lightbox
        showPrevImage();
    });
});