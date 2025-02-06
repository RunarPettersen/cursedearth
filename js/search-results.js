import { setupLoader } from './utils/loader.js';
import { db } from "./constants/api.js"; // ✅ Import Firestore setup
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

setupLoader();

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') ? urlParams.get('query').toLowerCase() : '';

    document.getElementById('searchInput').value = query; // Display query in search input

    if (query) {
        await fetchAndDisplayResults(query);
    }
});

/**
 * ✅ Fetch destinations from Firestore and filter based on the search query.
 */
const fetchAndDisplayResults = async (query) => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let places = [];

        querySnapshot.forEach((doc) => {
            places.push({ id: doc.id, ...doc.data() });
        });

        displaySearchResults(places, query);
    } catch (error) {
        console.error('❌ Error fetching search results:', error);
        displayMessage('An error occurred while fetching search results. Please try again later.', 'error');
    }
};

/**
 * ✅ Display search results dynamically.
 */
const displaySearchResults = (places, query) => {
    const resultsSection = document.getElementById('searchResults');
    resultsSection.innerHTML = ''; // Clear previous results

    const filteredPlaces = places.filter(place => 
        place.title.toLowerCase().includes(query) || 
        place.introduction.toLowerCase().includes(query) || 
        (place.description && place.description.toLowerCase().includes(query)) // In case description is missing
    );

    if (filteredPlaces.length > 0) {
        filteredPlaces.forEach(place => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.innerHTML = `
                <h3><a href="discover/detail.html?id=${place.id}">${place.title}</a></h3>
                <p>${place.introduction || "No description available."}</p>
                <a href="discover/detail.html?id=${place.id}" class="view-details-link">View Details</a>
            `;
            resultsSection.appendChild(resultItem);
        });
    } else {
        resultsSection.innerHTML = '<p>No results found for your search query.</p>';
    }
};