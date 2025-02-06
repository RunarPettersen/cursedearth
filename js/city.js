import { db } from "../js/constants/api.js"; // ✅ Firestore setup
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/**
 * ✅ Fetch Destinations for Selected City
 */
const fetchCityDestinations = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get("city");

    if (!cityName) {
        console.error("❌ No city name found in URL.");
        document.getElementById("cityDestinations").innerHTML = "<p>City not specified.</p>";
        return;
    }

    try {
        const destinationsRef = collection(db, "destinations");
        const q = query(destinationsRef, where("city", "==", cityName));
        const querySnapshot = await getDocs(q);

        const cityDestinationsSection = document.getElementById("cityDestinations");
        cityDestinationsSection.innerHTML = ""; // Clear loading text

        if (querySnapshot.empty) {
            document.getElementById("cityHeader").textContent = cityName;
            document.getElementById("destinationCount").textContent = `No destinations found in ${cityName}.`;
            return;
        }

        // ✅ Get the number of destinations
        const totalDestinations = querySnapshot.size;
        
        // ✅ Get the country from the first destination
        let countryName = "";
        let alternativeCountryName = "";
        querySnapshot.forEach((doc) => {
            if (doc.data().country) {
                countryName = doc.data().country;
                alternativeCountryName = doc.data().alternativeCountryName || countryName; // If an alternative name exists, use it
            }
        });

        // ✅ Update Page Headings
        document.getElementById("cityHeader").textContent = `${cityName}, ${countryName}`;
        document.getElementById("destinationCount").textContent = 
            `${totalDestinations} dark, morbid, and fun destinations in ${cityName}, ${alternativeCountryName}`;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const destinationDiv = document.createElement("div");
            destinationDiv.classList.add("destination-card");

            destinationDiv.innerHTML = `
                <h3>${data.title}</h3>
                <img src="../${data.image || 'images/placeholder.jpg'}" alt="${data.title}">
                <p>${data.introduction || "No description available."}</p>
                <button onclick="window.location.href='../discover/detail.html?id=${doc.id}'">View Details</button>
            `;

            cityDestinationsSection.appendChild(destinationDiv);
        });

        console.log(`✅ ${totalDestinations} destinations for ${cityName} loaded successfully!`);

    } catch (error) {
        console.error("❌ Error fetching city destinations:", error);
        document.getElementById("cityDestinations").innerHTML = "<p>Error loading destinations.</p>";
    }
};

// ✅ Run Fetch Function When Page Loads
document.addEventListener("DOMContentLoaded", fetchCityDestinations);