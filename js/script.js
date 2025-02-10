import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/displayMessage.js';
import { db } from "./constants/api.js";
import { saveUserDestinationStatus, getUserDestinationStatus } from "./utils/statusManager.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

setupLoader();

const auth = getAuth();

/**
 * ✅ Fetch and Display Limited Destinations for the Homepage
 */
async function displayDestinations(user) {
    const restaurantSection = document.querySelector(".restaurants-section");
    const monumentSection = document.querySelector(".monuments-section");
    const occultSection = document.querySelector(".occult-section");

    if (!restaurantSection || !monumentSection || !occultSection) {
        console.error("❌ Error: Sections not found in the HTML.");
        return;
    }

    restaurantSection.innerHTML = "";
    monumentSection.innerHTML = "";
    occultSection.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        const restaurants = [];
        const monuments = [];
        const occult = [];

        querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            if (data.category.includes("restaurant")) {
                restaurants.push(data);
            } else if (data.category.includes("monument")) {
                monuments.push(data);
            } else if (data.category.includes("occult")) {
                occult.push(data);
            }
        });

        // ✅ Display up to 4 items for each category
        await displayLimitedDestinations(restaurants, restaurantSection, "restaurants");
        await displayLimitedDestinations(monuments, monumentSection, "monuments");
        await displayLimitedDestinations(occult, occultSection, "occult");

        console.log("✅ Destinations loaded successfully!");

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
        displayMessage('Could not load destinations. Please try again.', 'error');
    }
}

/**
 * ✅ Display Only 4 Destinations per Category on Homepage
 */
const displayLimitedDestinations = async (destinations, section, category) => {
    section.innerHTML = ""; // Clear section

    const limitedDestinations = destinations.slice(0, 4); // Limit to 4 items

    for (const data of limitedDestinations) { // ✅ Loop through destinations
        const destinationDiv = document.createElement("div");
        destinationDiv.classList.add("place-item");
        destinationDiv.innerHTML = `
            <a href="../discover/detail.html?id=${data.id}" class="destination-link">
                <h3>${data.title || "Unknown Title"}, ${data.country || "Unknown Country"}</h3>
                <img src="${data.image || 'images/placeholder.jpg'}" alt="${data.title || 'No Image'}" class="place-image">
                <p>${data.introduction || "No description available."}</p>
            </a>
            <div class="status-buttons">
                <button class="wantToGo-btn tooltip" data-id="${data.id}">
                    Want to go <span class="tooltiptext">Save this destination</span>
                </button>
                <button class="beenHere-btn tooltip" data-id="${data.id}">
                    Been here <span class="tooltiptext">Mark as visited</span>
                </button>
            </div>
        `;
        section.appendChild(destinationDiv);

        // ✅ Apply saved status from the database
        await applySavedStatus(data.id);
    }

    // ✅ Attach event listeners after rendering
    setTimeout(() => attachEventListeners(), 500);

    // ✅ Add "See All" Link at the End
    if (destinations.length > 4) {
        const seeAllLink = document.createElement("a");
        seeAllLink.href = `../themes/${category}/index.html`;
        seeAllLink.classList.add("see-all-link");
        seeAllLink.textContent = `See all ${category}`;
        section.appendChild(seeAllLink);
    }
};

/**
 * ✅ Apply Saved Status to Buttons (Runs After Page Load)
 */
const applySavedStatus = async (destinationId) => {
    const status = await getUserDestinationStatus(destinationId);
    
    setTimeout(() => {
        document.querySelectorAll(`.wantToGo-btn[data-id="${destinationId}"]`).forEach(btn => {
            if (status.wantToGo) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        document.querySelectorAll(`.beenHere-btn[data-id="${destinationId}"]`).forEach(btn => {
            if (status.beenHere) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });
    }, 100);
};

/**
 * ✅ Attach Event Listeners to Buttons
 */
const attachEventListeners = () => {
    document.querySelectorAll(".wantToGo-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevent link click
            const destinationId = e.target.getAttribute("data-id");
            await saveUserDestinationStatus(destinationId, "wantToGo");
            applySavedStatus(destinationId);
        });
    });

    document.querySelectorAll(".beenHere-btn").forEach(button => {
        button.addEventListener("click", async (e) => {
            e.stopPropagation(); // Prevent link click
            const destinationId = e.target.getAttribute("data-id");
            await saveUserDestinationStatus(destinationId, "beenHere");
            applySavedStatus(destinationId);
        });
    });
};

// ✅ Run the App Once User is Authenticated
onAuthStateChanged(auth, (user) => {
    const isAdminPage = window.location.pathname.includes("/admin/"); // Check if on admin page

    if (user) {
        console.log(`✅ Logged in as: ${user.email}`);
        displayDestinations(user);
    } else if (isAdminPage) {
        console.warn("⚠️ User not logged in. Redirecting to login...");
        window.location.href = "../auth/login.html";
    } else {
        console.warn("⚠️ User not logged in. Proceeding as guest.");
        displayDestinations(null); // Allow public viewing
    }
});