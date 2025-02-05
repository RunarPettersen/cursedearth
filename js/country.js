import { fetchDestinationsForCountry } from "./destinations.js";

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country");

    if (!country) {
        console.error("❌ No country provided in URL.");
        document.getElementById("countryDestinations").innerHTML = "<p>Error: No country selected.</p>";
        return;
    }

    document.getElementById("countryTitle").textContent = country;

    const destinations = await fetchDestinationsForCountry(country);

    if (destinations.length === 0) {
        document.getElementById("countryDestinations").innerHTML = "<p>No destinations found in this country.</p>";
        return;
    }

    document.getElementById("countryDestinations").innerHTML = destinations.map(destination => `
        <div class="destination-card">
            <h3>${destination.title}</h3>
            <img src="../${destination.image || 'images/placeholder.jpg'}" alt="${destination.title}">
            <p>${destination.introduction}</p>
            <button onclick="window.location.href='../discover/detail.html?id=${destination.id}'">View Details</button>
        </div>
    `).join("");
});
