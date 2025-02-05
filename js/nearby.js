import { setupLoader } from './utils/loader.js';
import { db } from "./constants/api.js"; // ✅ Import Firestore config
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

setupLoader();

// ✅ Calculate Distance Between Two Coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
};

// ✅ Toggle Fullscreen Mode for Map
const toggleFullscreen = (element) => {
    if (!document.fullscreenElement) {
        element.requestFullscreen().catch(err => {
            console.error(`Error enabling fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};

// ✅ Create Fullscreen Button for Map
const createFullscreenButton = (mapContainer) => {
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-btn';
    fullscreenBtn.innerHTML = '🗖'; // Unicode fullscreen icon

    fullscreenBtn.style.position = 'absolute';
    fullscreenBtn.style.top = '10px';
    fullscreenBtn.style.right = '10px';
    fullscreenBtn.style.padding = '10px';
    fullscreenBtn.style.backgroundColor = 'white';
    fullscreenBtn.style.border = 'none';
    fullscreenBtn.style.borderRadius = '4px';
    fullscreenBtn.style.cursor = 'pointer';
    fullscreenBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';

    fullscreenBtn.addEventListener('click', () => toggleFullscreen(mapContainer));
    mapContainer.appendChild(fullscreenBtn);
};

// ✅ Fetch & Display Nearby Places
const showNearbyPlaces = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let places = [];

        querySnapshot.forEach(doc => {
            places.push({ id: doc.id, ...doc.data() });
        });

        if (!navigator.geolocation) {
            document.getElementById('nearbyList').innerHTML = '<p>Geolocation is not supported by your browser.</p>';
            return;
        }

        // ✅ Get User's Current Location
        navigator.geolocation.getCurrentPosition(position => {
            const userLatitude = position.coords.latitude;
            const userLongitude = position.coords.longitude;

            // ✅ Calculate Distance for Each Place
            places.forEach(place => {
                place.distance = calculateDistance(userLatitude, userLongitude, place.latitude, place.longitude);
            });

            // ✅ Sort Places by Distance & Display Closest 8
            const nearbyPlaces = places.sort((a, b) => a.distance - b.distance).slice(0, 16);

            // ✅ Display Nearby Places in Grid
            const nearbyList = document.getElementById('nearbyList');
            nearbyList.innerHTML = nearbyPlaces.map(place => `
                <div class="nearby-item">
                    <img src="../${place.image || 'images/placeholder.jpg'}" alt="${place.title}" class="nearby-image">
                    <h3>${place.title}</h3>
                    <p class="description">${place.introduction}</p>
                    <p class="distance">${place.distance.toFixed(2)} km away</p>
                    <button onclick="window.location.href='../discover/detail.html?id=${place.id}'">View Details</button>
                </div>
            `).join('');

            // ✅ Initialize Map with User's Location
            const mapContainer = document.getElementById('map');
            const map = L.map(mapContainer).setView([userLatitude, userLongitude], 13);

            // ✅ Add OpenStreetMap Tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // ✅ Add Marker for User's Location
            L.marker([userLatitude, userLongitude]).addTo(map)
                .bindPopup('You are here')
                .openPopup();

            // ✅ Add Markers for All Nearby Places
            nearbyPlaces.forEach(place => {
                L.marker([place.latitude, place.longitude]).addTo(map)
                    .bindPopup(`
                        <b><a href="../discover/detail.html?id=${place.id}" target="_blank" rel="noopener noreferrer">${place.title}</a></b><br>
                        ${place.introduction}<br>
                        ${place.distance.toFixed(2)} km away
                    `);
            });

            // ✅ Add Fullscreen Button to Map
            createFullscreenButton(mapContainer);

        }, error => {
            document.getElementById('nearbyList').innerHTML = `<p>Unable to retrieve your location. Error: ${error.message}</p>`;
        });
    } catch (error) {
        console.error('❌ Error fetching nearby places:', error);
        document.getElementById('nearbyList').innerHTML = '<p>Failed to load nearby places.</p>';
    }
};

// ✅ Run App on Page Load
document.addEventListener('DOMContentLoaded', showNearbyPlaces);