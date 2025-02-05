import { displayMessage } from './displayMessage.js'; 
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ✅ Firebase Config (Same as script.js)
const firebaseConfig = {
    apiKey: "AIzaSyASIwVcfix2ePJR5sy-z_63uTUSZcbS_LU",
    authDomain: "cursed-earth.firebaseapp.com",
    projectId: "cursed-earth",
    storageBucket: "cursed-earth.appspot.com",
    messagingSenderId: "831111750860",
    appId: "1:831111750860:web:598aef5bc1c8315b768e69",
    measurementId: "G-JWN7J3SBE3"
};

// ✅ Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fetch Destinations from Firestore
export const fetchPlaces = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        const places = [];

        querySnapshot.forEach((doc) => {
            places.push(doc.data()); // Add Firestore data to array
        });

        console.log("✅ Destinations fetched from Firestore:", places);

        // ✅ Display places by category
        displayPlaces(places, 'restaurant', '.restaurants-section'); 
        displayPlaces(places, 'monument', '.monuments-section');

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
        displayMessage('Failed to load places. Please check your internet connection and try again.', 'error');
    }
};

// ✅ Display Places (Same as before)
export const displayPlaces = (places, category, sectionSelector) => {
    const placesSection = document.querySelector(sectionSelector);
    let displayedCount = 3;

    // Filter by category
    const filteredPlaces = places.filter(place => {
        const categories = Array.isArray(place.category) ? place.category : [place.category];
        return categories.map(cat => cat.toLowerCase()).includes(category.toLowerCase());
    });

    const renderPlaces = (count) => {
        placesSection.innerHTML = '';

        const placesToShow = filteredPlaces.slice(0, count);

        placesToShow.forEach(place => {
            const placeElement = document.createElement('div');
            placeElement.className = 'place-item';
            placeElement.style.cursor = 'pointer';

            placeElement.addEventListener('click', () => {
                window.location.href = `discover/detail.html?id=${place.id}`;
            });

            const parser = new DOMParser();
            const parsedDescription = parser.parseFromString(place.description, 'text/html');
            const textContent = parsedDescription.body.textContent || "";
            const shortDescription = textContent.slice(0, 200) + (textContent.length > 200 ? '...' : '');

            placeElement.innerHTML = `
                <h3>${place.title}</h3>
                <p class="description">${shortDescription}</p>
                <img src="${place.image}" alt="${place.title}" class="place-image">
            `;
            placesSection.appendChild(placeElement);
        });

        if (count < filteredPlaces.length) {
            const seeMoreElement = document.createElement('div');
            seeMoreElement.className = 'place-item see-more';
            seeMoreElement.innerHTML = `
                <p>Find more places in the same category to visit.</p>
                <button class="see-more-btn">See More</button>
            `;
            seeMoreElement.addEventListener('click', () => {
                displayedCount += 3;
                renderPlaces(displayedCount);
            });
            placesSection.appendChild(seeMoreElement);
        }
    };

    renderPlaces(displayedCount);
};