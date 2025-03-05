import { setupLoader } from './utils/loader.js';
import { db } from "./constants/api.js"; // ✅ Import Firestore from API config
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

setupLoader();

// ✅ Fetch Destinations from Firestore
const fetchDestinations = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let destinations = [];

        querySnapshot.forEach(doc => {
            destinations.push({ id: doc.id, ...doc.data() });
        });

        if (destinations.length === 0) {
            console.warn("⚠️ No destinations found in Firestore.");
            return;
        }

        // ✅ Sort by date (newest first)
        destinations.sort((a, b) => new Date(b.date) - new Date(a.date));

        // ✅ Display sorted destinations
        displayDestinations(destinations);

        // ✅ Setup event listeners for filtering & sorting
        document.getElementById('categorySelect').addEventListener('change', (event) => {
            filterDestinations(destinations, event.target.value);
        });

        document.getElementById('sortOrderSelect').addEventListener('change', (event) => {
            sortDestinations(destinations, event.target.value);
        });

        console.log("✅ Destinations loaded successfully!");

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
    }
};

// ✅ Sort and Display Destinations
const sortDestinations = (destinations, order) => {
    if (order === 'newest') {
        destinations.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (order === 'oldest') {
        destinations.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (order === 'highest-secret') {
        destinations.sort((a, b) => parseInt(b.darknessLevel, 10) - parseInt(a.darknessLevel, 10));
    } else if (order === 'lowest-secret') {
        destinations.sort((a, b) => parseInt(a.darknessLevel, 10) - parseInt(b.darknessLevel, 10));
    }
    displayDestinations(destinations);
};

// ✅ Display Destinations in Grid
const displayDestinations = (destinations) => {
    const destinationsGrid = document.getElementById('destinationsGrid');
    destinationsGrid.innerHTML = '';

    destinations.forEach(destination => {
        const destinationCard = document.createElement('div');
        destinationCard.className = 'destination-card';

        destinationCard.innerHTML = `
            <img src="../${destination.image || 'images/placeholder.jpg'}" alt="${destination.title}" class="destination-image">
            <h2>${destination.title}</h2>
            <p><a href="../destinations/city.html?city=${destination.city}">${destination.city}</a>, <a href="../destinations/country.html?country=${destination.country}">${destination.country}</a></p>
            <p>${destination.introduction}</p>
            <button class="details-btn" data-id="${destination.id}">View Details</button>
        `;
        
        destinationsGrid.appendChild(destinationCard);
    });

    // ✅ Add event listeners to "View Details" buttons
    document.querySelectorAll('.details-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const destinationId = event.target.getAttribute('data-id');
            window.location.href = `detail.html?id=${destinationId}`;
        });
    });
};

// ✅ Filter Destinations by Category
const filterDestinations = (destinations, selectedCategory) => {
    if (selectedCategory === 'all') {
        displayDestinations(destinations);
    } else {
        const filteredDestinations = destinations.filter(destination =>
            destination.category.map(cat => cat.toLowerCase()).includes(selectedCategory.toLowerCase())
        );
        displayDestinations(filteredDestinations);
    }
};

// ✅ Run App on Page Load
document.addEventListener('DOMContentLoaded', fetchDestinations);