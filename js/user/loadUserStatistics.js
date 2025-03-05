import { db } from "../constants/api.js";
import { doc, getDoc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/**
 * ✅ Fetch User Statistics (Want to Go, Been Here, Visited Countries & Cities)
 */
export const loadUserStatistics = async (uid) => {
    try {
        const userDestRef = doc(db, "user_destinations", uid);
        const userDestSnap = await getDoc(userDestRef);

        // ✅ Fetch total destinations count from Firestore
        const totalDestRef = collection(db, "destinations");
        const totalDestSnap = await getCountFromServer(totalDestRef);
        const totalDestinations = totalDestSnap.data().count || 0;

        // ✅ If user has no saved destinations, set default values
        if (!userDestSnap.exists()) {
            updateStatistics(0, totalDestinations);
            return;
        }

        const userData = userDestSnap.data();
        const wantToGoCount = userData.wantToGo ? userData.wantToGo.length : 0;
        const beenHereCount = userData.beenHere ? userData.beenHere.length : 0;

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

        // ✅ Update UI
        updateStatistics(beenHereCount, totalDestinations);
        document.getElementById("wantToGoCount").textContent = wantToGoCount;
        document.getElementById("beenHereCount").textContent = beenHereCount;
        document.getElementById("countriesCount").textContent = countrySet.size;
        document.getElementById("citiesCount").textContent = citySet.size;

    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
    }
};

/**
 * ✅ Update Statistics UI
 */
const updateStatistics = (visited, total) => {
    document.getElementById("visitedCount").textContent = visited;
    document.getElementById("totalDestinations").textContent = total;

    // ✅ Calculate percentage
    const percentage = total > 0 ? ((visited / total) * 100).toFixed(1) : 0;
    document.getElementById("visitedPercentage").textContent = percentage;

    // ✅ Update Progress Bar Width
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = `${percentage}%`;
};