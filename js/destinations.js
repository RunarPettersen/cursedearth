import { db } from "../js/constants/api.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ✅ Select elements
const countriesList = document.getElementById("countriesList");

// ✅ Load Continents from JSON
const fetchContinents = async () => {
    try {
        const response = await fetch("../json/continents.json"); // ✅ Load JSON
        const continentsData = await response.json();

        console.log("✅ Continents loaded:", continentsData);
        setupContinentButtons(continentsData);

    } catch (error) {
        console.error("❌ Error loading continents:", error);
    }
};

// ✅ Set up continent buttons to display countries
const setupContinentButtons = (continentsData) => {
    document.querySelectorAll(".continent-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const selectedContinent = button.getAttribute("data-continent");
            displayCountries(continentsData[selectedContinent] || []);
        });
    });
};

// ✅ Display countries for the selected continent
const displayCountries = (countries) => {
    if (countries.length === 0) {
        countriesList.innerHTML = "<p>No countries found.</p>";
        return;
    }

    countriesList.innerHTML = ""; // Clear previous content

    countries.forEach((country) => {
        const button = document.createElement("button");
        button.textContent = country;
        button.classList.add("country-btn");
        button.addEventListener("click", () => {
            window.location.href = `../destinations/country.html?country=${encodeURIComponent(country)}`;
        });

        countriesList.appendChild(button);
    });
};

// ✅ Fetch destinations from Firestore (when needed for the country page)
export const fetchDestinationsForCountry = async (country) => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        const destinations = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.country === country) {
                destinations.push({ id: doc.id, ...data });
            }
        });

        return destinations;

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
        return [];
    }
};

// ✅ Load continents when the page loads
document.addEventListener("DOMContentLoaded", fetchContinents);