import { db } from "./constants/api.js"; 
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/**
 * ✅ Fetch and Rank Top 10 Destinations for "Been Here" & "Want to Go"
 */
export const fetchTopDestinations = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "user_destinations"));

        let destinationCounts = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            ["beenHere", "wantToGo"].forEach(status => {
                if (data[status]) {
                    data[status].forEach(destinationId => {
                        if (!destinationCounts[destinationId]) {
                            destinationCounts[destinationId] = { beenHere: 0, wantToGo: 0 };
                        }
                        destinationCounts[destinationId][status]++;
                    });
                }
            });
        });

        let sortedBeenHere = Object.entries(destinationCounts)
            .sort((a, b) => b[1].beenHere - a[1].beenHere)
            .slice(0, 10);

        let sortedWantToGo = Object.entries(destinationCounts)
            .sort((a, b) => b[1].wantToGo - a[1].wantToGo)
            .slice(0, 10);

        displayTopDestinations(sortedBeenHere, "beenHereList");
        displayTopDestinations(sortedWantToGo, "wantToGoList");

    } catch (error) {
        console.error("❌ Error fetching top destinations:", error);
    }
};

/**
 * ✅ Display Top 10 in List (With Clickable Links)
 */
const displayTopDestinations = async (topDestinations, listId) => {
    const listElement = document.getElementById(listId);
    if (!listElement) return;

    listElement.innerHTML = "<p>Loading...</p>";

    let listHTML = "";

    for (const [destinationId, counts] of topDestinations) {
        const destinationRef = doc(db, "destinations", destinationId);
        const destinationSnap = await getDoc(destinationRef);

        if (destinationSnap.exists()) {
            const destination = destinationSnap.data();
            const count = counts[listId === "beenHereList" ? "beenHere" : "wantToGo"];

            listHTML += `
                <li class="top-destination">
                    <img src="../${destination.image || 'images/placeholder.jpg'}" alt="${destination.title}" class="top-destination-img">
                    <a href="../discover/detail.html?id=${destinationId}" class="top-destination-link">
                        <div class="top-destination-info">
                            <strong>${destination.title}</strong><br>
                    <a>
                            <span>${destination.city}, ${destination.country}</span><br>
                            <span class="count">${count} times</span>
                        </div>
                </li>
            `;
        }
    }

    listElement.innerHTML = listHTML;
};

// ✅ Load Data when Page Loads
document.addEventListener("DOMContentLoaded", fetchTopDestinations);