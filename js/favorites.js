import { setupLoader } from './utils/loader.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "./constants/api.js"; // ✅ Firestore setup

setupLoader();

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM Loaded, initializing script...");

    const wantToGoSection = document.getElementById("wantToGoSection");
    const beenHereSection = document.getElementById("beenHereSection");

    if (!wantToGoSection || !beenHereSection) {
        console.error("❌ Error: Sections missing in favorites.html.");
        return;
    }

    // ✅ Ensure User is Logged In Before Fetching Data
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.warn("⚠️ User not logged in, redirecting...");
            window.location.href = "../auth/login.html";
            return;
        }

        console.log(`✅ Logged in as: ${user.email}`);
        loadUserSavedDestinations(user.uid);
    });
});

// ✅ Fetch User's "Want to Go" & "Been Here" Destinations
const loadUserSavedDestinations = async (uid) => {
    try {
        console.log("📌 Fetching user saved destinations...");

        const wantToGoSection = document.getElementById("wantToGoSection");
        const beenHereSection = document.getElementById("beenHereSection");

        wantToGoSection.innerHTML = "<p>Loading...</p>";
        beenHereSection.innerHTML = "<p>Loading...</p>";

        const userDestRef = doc(db, "user_destinations", uid);
        const userDestSnap = await getDoc(userDestRef);

        if (!userDestSnap.exists()) {
            console.warn("⚠️ No saved destinations found.");
            wantToGoSection.innerHTML = "<p>No places in 'Want to Go'.</p>";
            beenHereSection.innerHTML = "<p>No places in 'Been Here'.</p>";
            return;
        }

        const userDestinations = userDestSnap.data();
        const wantToGo = userDestinations.wantToGo || [];
        const beenHere = userDestinations.beenHere || [];

        console.log(`📌 Want to Go Count: ${wantToGo.length}, Been Here Count: ${beenHere.length}`);

        wantToGoSection.innerHTML = wantToGo.length
            ? await displaySavedDestinations(wantToGo, "wantToGo", uid)
            : "<p>No places in 'Want to Go'.</p>";

        beenHereSection.innerHTML = beenHere.length
            ? await displaySavedDestinations(beenHere, "beenHere", uid)
            : "<p>No places in 'Been Here'.</p>";

    } catch (error) {
        console.error("❌ Error loading saved destinations:", error);
    }
};

// ✅ Display Saved Destinations with Remove Button
const displaySavedDestinations = async (destinationIDs, status, uid) => {
    console.log("📌 Populating saved destinations...");

    let html = "";

    for (const id of destinationIDs) {
        const destinationRef = doc(db, "destinations", id);
        const destinationSnap = await getDoc(destinationRef);

        if (destinationSnap.exists()) {
            const destination = destinationSnap.data();
            html += `
                <div class="destination-card" id="destination-${id}">
                    <img src="../${destination.image || 'images/placeholder.jpg'}" alt="${destination.title}" class="destination-image">
                    <h2>${destination.title}</h2>
                    <p>${destination.introduction}</p>
                    <button onclick="window.location.href='../discover/detail.html?id=${id}'">View Details</button>
                    <button class="remove-btn" data-id="${id}" data-status="${status}" data-uid="${uid}">Remove</button>
                </div>
            `;
        } else {
            console.warn("⚠️ Destination not found in Firestore:", id);
        }
    }

    return html;
};

// ✅ Remove Destination from Firestore & Update UI
const removeUserDestination = async (uid, destinationId, status) => {
    try {
        const userDestRef = doc(db, "user_destinations", uid);
        const userDestSnap = await getDoc(userDestRef);

        if (!userDestSnap.exists()) return;

        let userDestinations = userDestSnap.data();

        // ✅ Remove the destination from the chosen category
        userDestinations[status] = userDestinations[status].filter(id => id !== destinationId);

        await updateDoc(userDestRef, userDestinations);

        console.log(`🚫 Removed destination "${destinationId}" from "${status}".`);

        // ✅ Remove from UI instantly
        document.getElementById(`destination-${destinationId}`)?.remove();

        // ✅ If list is empty after removal, show a message
        if (userDestinations[status].length === 0) {
            document.getElementById(status === "wantToGo" ? "wantToGoSection" : "beenHereSection").innerHTML = "<p>No places found.</p>";
        }

    } catch (error) {
        console.error("❌ Error removing destination:", error);
    }
};

// ✅ Attach Event Listeners AFTER Elements Are Loaded
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const destinationId = event.target.getAttribute("data-id");
        const status = event.target.getAttribute("data-status");
        const uid = event.target.getAttribute("data-uid");

        await removeUserDestination(uid, destinationId, status);
    }
});

