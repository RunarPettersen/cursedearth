import { setupLoader } from './utils/loader.js';
import { displayMessage } from './utils/displayMessage.js';
import { db } from "./constants/api.js";
import { saveUserDestinationStatus, getUserDestinationStatus } from "./utils/statusManager.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

setupLoader();

const auth = getAuth();

/**
 * ✅ Fetch and Display Destinations from Firestore
 */
async function displayDestinations(user) {
    const restaurantSection = document.querySelector(".restaurants-section");
    const monumentSection = document.querySelector(".monuments-section");

    if (!restaurantSection || !monumentSection) {
        console.error("❌ Error: Sections not found in the HTML.");
        return;
    }

    restaurantSection.innerHTML = "";
    monumentSection.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));

        if (querySnapshot.empty) {
            console.warn("⚠️ No destinations found in Firestore.");
            restaurantSection.innerHTML = "<p>No restaurants available.</p>";
            monumentSection.innerHTML = "<p>No monuments available.</p>";
            return;
        }

        querySnapshot.forEach(async (doc) => {
            const data = doc.data();
            const destinationDiv = document.createElement("div");
            destinationDiv.classList.add("place-item");

            // ✅ Make the entire card clickable, except for buttons
            destinationDiv.innerHTML = `
                <a href="../discover/detail.html?id=${doc.id}" class="destination-link">
                    <h3>${data.title || "Unknown Title"}, ${data.country || "Unknown Country"}</h3>
                    <img src="${data.image || 'images/placeholder.jpg'}" alt="${data.title || 'No Image'}" class="place-image">
                    <p>${data.introduction || "No description available."}</p>
                </a>
                <div class="status-buttons">
                    <button class="wantToGo-btn tooltip" data-id="${doc.id}">
                        Want to go <span class="tooltiptext">Save this destination</span>
                    </button>
                    <button class="beenHere-btn tooltip" data-id="${doc.id}">
                        Been here <span class="tooltiptext">Mark as visited</span>
                    </button>
                </div>
            `;

            if (data.category.includes("restaurant")) {
                restaurantSection.appendChild(destinationDiv);
            } else if (data.category.includes("monument")) {
                monumentSection.appendChild(destinationDiv);
            }

            // ✅ Fetch and Apply Saved Status
            await applySavedStatus(doc.id);
        });

        // ✅ Attach event listeners for buttons after rendering
        setTimeout(() => attachEventListeners(), 500);

        console.log("✅ Destinations loaded successfully!");

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
        displayMessage('Could not load destinations. Please try again.', 'error');
    }
}

/**
 * ✅ Apply Saved Status to Buttons
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
    if (user) {
        console.log(`✅ Logged in as: ${user.email}`);
        displayDestinations(user);
    } else {
        console.warn("⚠️ User not logged in. Redirecting...");
        window.location.href = "../auth/login.html";
    }
});