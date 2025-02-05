import { db } from "../constants/api.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { showNearbyPlaces } from "./nearbyCalculator.js";

export const fetchNearbyPlaces = async (currentDestination) => {
    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let allDestinations = [];

        querySnapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            allDestinations.push(data);
        });

        const filteredDestinations = allDestinations.filter(dest => dest.id !== currentDestination.id);
        showNearbyPlaces(currentDestination, filteredDestinations);

    } catch (error) {
        console.error("❌ Error fetching nearby places:", error);
    }
};