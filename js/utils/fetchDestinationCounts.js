import { db } from "../constants/api.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/**
 * ✅ Fetch and display "Been Here" & "Want to Go" counts for a destination
 * @param {string} destinationId - The ID of the destination
 */
export const fetchDestinationCounts = async (destinationId) => {
    try {
        const querySnapshot = await getDocs(collection(db, "user_destinations"));
        let beenHereCount = 0;
        let wantToGoCount = 0;

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.beenHere && userData.beenHere.includes(destinationId)) {
                beenHereCount++;
            }
            if (userData.wantToGo && userData.wantToGo.includes(destinationId)) {
                wantToGoCount++;
            }
        });

        document.getElementById("beenHereCount").textContent = beenHereCount;
        document.getElementById("wantToGoCount").textContent = wantToGoCount;

    } catch (error) {
        console.error("❌ Error fetching destination counts:", error);
    }
};