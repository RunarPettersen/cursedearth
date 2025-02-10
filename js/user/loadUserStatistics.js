import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "../constants/api.js";

export const loadUserStatistics = async (uid) => {
    try {
        const userDestRef = doc(db, "user_destinations", uid);
        const userDestSnap = await getDoc(userDestRef);

        if (!userDestSnap.exists()) {
            console.warn("⚠️ No user destinations found.");
            document.getElementById("wantToGoCount").textContent = "0";
            document.getElementById("beenHereCount").textContent = "0";
            document.getElementById("countriesCount").textContent = "0";
            document.getElementById("citiesCount").textContent = "0";
            return;
        }

        const userData = userDestSnap.data();
        const wantToGoCount = userData.wantToGo ? userData.wantToGo.length : 0;
        const beenHereCount = userData.beenHere ? userData.beenHere.length : 0;

        document.getElementById("wantToGoCount").textContent = wantToGoCount;
        document.getElementById("beenHereCount").textContent = beenHereCount;

        // ✅ Fetch and Count Unique Countries and Cities
        const visitedDestinations = userData.beenHere || [];
        const countrySet = new Set();
        const citySet = new Set();

        for (const destinationId of visitedDestinations) {
            const destinationRef = doc(db, "destinations", destinationId);
            const destinationSnap = await getDoc(destinationRef);

            if (destinationSnap.exists()) {
                const destination = destinationSnap.data();
                if (destination.country) countrySet.add(destination.country);
                if (destination.city) citySet.add(destination.city);
            }
        }

        document.getElementById("countriesCount").textContent = countrySet.size;
        document.getElementById("citiesCount").textContent = citySet.size;

    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
    }
};