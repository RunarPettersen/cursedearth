import { db } from "../constants/api.js";
import { doc, getDoc, collection, getCountFromServer } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/**
 * ✅ Fetch User Statistics (Been Here Count, Total Destinations, Percentage)
 */
export const loadUserStatistics = async (uid) => {
    try {
        const userDestRef = doc(db, "user_destinations", uid);
        const userDestSnap = await getDoc(userDestRef);

        // ✅ Fetch total destinations count in Firestore
        const totalDestRef = collection(db, "destinations");
        const totalDestSnap = await getCountFromServer(totalDestRef);
        const totalDestinations = totalDestSnap.data().count || 0;

        // ✅ If user has no saved destinations, display 0
        if (!userDestSnap.exists()) {
            updateStatistics(0, totalDestinations);
            return;
        }

        const userData = userDestSnap.data();
        const visitedCount = userData.beenHere ? userData.beenHere.length : 0;

        // ✅ Update UI
        updateStatistics(visitedCount, totalDestinations);

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
};