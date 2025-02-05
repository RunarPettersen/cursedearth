const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat) / 2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
};

// Show nearby places relative to the current destination
export const showNearbyPlaces = (currentDestination, allDestinations) => {
    const nearbyPlaces = allDestinations
        .filter(place => place.id !== currentDestination.id)
        .map(place => {
            place.distance = calculateDistance(
                currentDestination.latitude,
                currentDestination.longitude,
                place.latitude,
                place.longitude
            );
            return place;
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4); // Take the four closest places

    const nearbyList = document.getElementById('nearbyList');
    if (nearbyPlaces.length > 0) {
        nearbyList.innerHTML = nearbyPlaces.map(place => `
            <div class="nearby-item">
                <img src="../${place.image}" alt="${place.title}" class="nearby-image">
                <h3>${place.title}</h3>
                <p class="description">${place.introduction}</p>
                <button onclick="window.location.href='detail.html?id=${place.id}'">View Details</button>
            </div>
        `).join('');
    } else {
        nearbyList.innerHTML = '<p>No nearby places found.</p>';
    }
};