import { db } from "../constants/api.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { updateMetaTags } from "./metaTags.js";
import { displayDestinationDetails } from "./displayDestination.js";
import { displayGalleryImages } from "./gallery.js";
import { fetchNearbyPlaces } from "./nearbyPlaces.js";
import { initializeMap } from "./map.js";
import { fetchDestinationCounts } from "./fetchDestinationCounts.js"; // ✅ Import the new function

export const fetchDestinationDetails = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationId = urlParams.get("id");

    if (!destinationId) {
        console.error("No destination ID found in URL.");
        return;
    }

    try {
        const docRef = doc(db, "destinations", destinationId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            document.getElementById("destinationDetails").innerHTML = "<p>Destination not found.</p>";
            return;
        }

        const destination = { id: destinationId, ...docSnap.data() };

        updateMetaTags(destination);
        displayDestinationDetails(destination);
        displayGalleryImages(destination.galleryPath, destination.galleryImages);
        fetchNearbyPlaces(destination);
        initializeMap(destination);

        // ✅ Fetch and display "Been Here" & "Want to Go" counts
        fetchDestinationCounts(destinationId);

        console.log("✅ Destination loaded:", destination);
    } catch (error) {
        console.error("Error fetching destination details:", error);
    }
};