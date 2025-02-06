import { db } from "./constants/api.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchSpotlightDestinations();
});

// ✅ Global Variables
let currentSlide = 0;
let spotlightDestinations = [];
let autoplayInterval;

/**
 * ✅ Fetch Spotlight Destinations
 */
const fetchSpotlightDestinations = async () => {
    try {
        const q = query(collection(db, "destinations"), where("spotlight", "==", true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("⚠️ No spotlight destinations found.");
            return;
        }

        spotlightDestinations = [];
        querySnapshot.forEach((doc) => {
            spotlightDestinations.push({ id: doc.id, ...doc.data() });
        });

        displaySpotlightCarousel();
    } catch (error) {
        console.error("❌ Error fetching spotlight destinations:", error);
    }
};

/**
 * ✅ Display Spotlight Carousel
 */
const displaySpotlightCarousel = () => {
    const carouselInner = document.getElementById("carouselInner");
    const carouselDots = document.getElementById("carouselDots");

    if (!carouselInner || !carouselDots) {
        console.error("❌ Error: Carousel elements not found.");
        return;
    }

    carouselInner.innerHTML = "";
    carouselDots.innerHTML = "";

    spotlightDestinations.forEach((destination, index) => {
        // ✅ Create Slide
        const slide = document.createElement("div");
        slide.classList.add("carousel-item");
        if (index === 0) slide.classList.add("active");

        slide.innerHTML = `
            <a href="../discover/detail.html?id=${destination.id}">
                <img src="./${destination.image}" alt="${destination.title}">
                <div class="carousel-text">
                    <h3>${destination.title}</h3>
                    <p>${destination.introduction || "No introduction available."}</p>
                </div>
            </a>
        `;

        carouselInner.appendChild(slide);

        // ✅ Create Dot Indicators
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    startAutoplay();
};

// ✅ Navigation Buttons
const prevSlide = () => {
    currentSlide = (currentSlide - 1 + spotlightDestinations.length) % spotlightDestinations.length;
    updateCarousel();
};

const nextSlide = () => {
    currentSlide = (currentSlide + 1) % spotlightDestinations.length;
    updateCarousel();
};

const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
};

const updateCarousel = () => {
    const slides = document.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".dot");

    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
};

// ✅ Autoplay Feature
const startAutoplay = () => {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 3000);
};

// ✅ Pause Autoplay on Hover
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prevBtn").addEventListener("click", prevSlide);
    document.getElementById("nextBtn").addEventListener("click", nextSlide);

    const carousel = document.querySelector(".carousel");
    if (carousel) {
        carousel.addEventListener("mouseover", () => clearInterval(autoplayInterval));
        carousel.addEventListener("mouseleave", startAutoplay);
    }
});


