export const initializeMap = (destination) => {
    if (!destination.latitude || !destination.longitude) {
        console.warn("⚠️ No latitude or longitude provided for this destination.");
        document.getElementById('map').innerHTML = '<p>Location data not available.</p>';
        return;
    }

    const map = L.map('map').setView([destination.latitude, destination.longitude], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([destination.latitude, destination.longitude]).addTo(map)
        .bindPopup(`<b>${destination.title}</b><br>${destination.where || "Location unknown."}`)
        .openPopup();
};