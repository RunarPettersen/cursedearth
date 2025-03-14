import { saveUserDestinationStatus, getUserDestinationStatus } from "./statusManager.js";
import { fetchDestinationCounts } from "./fetchDestinationCounts.js"; // ✅ Import count function

export const displayDestinationDetails = (destination) => {
    const detailSection = document.getElementById("destinationDetails");

    const homepageLink = destination.homepage
        ? `<p><strong>Homepage:</strong> <a href="${destination.homepage}" target="_blank" rel="noopener noreferrer">${destination.homepage}</a></p>`
        : "";

    const secretLevelStars = "☠".repeat(Math.round(destination.darknessLevel / 10));
    const starClass = destination.darknessLevel === 100 ? "yellow-stars" : "default-stars";

    detailSection.innerHTML = `
        <p><strong><a href="../destinations/city.html?city=${destination.city}">${destination.city}</a>, <a href="../destinations/country.html?country=${destination.country}">${destination.country}</a></strong></p>
        <img src="../${destination.image || "images/placeholder.jpg"}" alt="${destination.title}" class="destination-image">
        <p><strong>${destination.introduction}</strong></p>
        <div class="description">${destination.description}</div>
        <p><strong>Location:</strong> ${destination.where || "Unknown"}</p>
        <p><strong>Address:</strong> ${destination.address || "Not Available"}</p>
        <p><strong>Category:</strong> ${destination.category.join(", ")}</p>
        <p><strong>Tags:</strong> ${destination.tags.join(", ")}</p>
        <p><strong>Darkness Level:</strong> <span class="${starClass}">${secretLevelStars}</span></p>
        ${homepageLink}

        <!-- ✅ Buttons with data-id for dynamic updates -->
        <button class="wantToGo-btn status-btn" data-id="${destination.id}">Want to Go</button>
        <button class="beenHere-btn status-btn" data-id="${destination.id}">Been Here</button>

        <!-- ✅ Placeholder for counts -->
        <p>☑ <span id="beenHereCount">0</span> users have been here</p>
        <p>☐ <span id="wantToGoCount">0</span> users want to go</p>

        <div id="gallery" class="gallery"></div>
        <section id="destination-map" class="destination-map">
            <h2>Map</h2>
            <div id="map" style="height: 400px;"></div>
        </section>
    `;

    document.getElementById("detail-title").textContent = destination.title;

    // ✅ Fetch saved status & apply button styles
    updateButtonStyles(destination.id);

    // ✅ Add event listeners for buttons
    attachDetailEventListeners(destination.id);

    // ✅ Fetch and display counts for "Been Here" & "Want to Go"
    fetchDestinationCounts(destination.id);
};

/**
 * ✅ Attach Click Event Listeners (Same Logic as Front Page)
 */
const attachDetailEventListeners = (destinationId) => {
    document.querySelector(`.wantToGo-btn[data-id="${destinationId}"]`).addEventListener("click", async () => {
        await saveUserDestinationStatus(destinationId, "wantToGo");
        updateButtonStyles(destinationId);
        fetchDestinationCounts(destinationId); // ✅ Update counts dynamically
    });

    document.querySelector(`.beenHere-btn[data-id="${destinationId}"]`).addEventListener("click", async () => {
        await saveUserDestinationStatus(destinationId, "beenHere");
        updateButtonStyles(destinationId);
        fetchDestinationCounts(destinationId); // ✅ Update counts dynamically
    });
};

/**
 * ✅ Fetch Status & Update Button Styles
 */
const updateButtonStyles = async (destinationId) => {
    const status = await getUserDestinationStatus(destinationId);

    const wantToGoBtn = document.querySelector(`.wantToGo-btn[data-id="${destinationId}"]`);
    const beenHereBtn = document.querySelector(`.beenHere-btn[data-id="${destinationId}"]`);

    if (status.wantToGo) {
        wantToGoBtn.classList.add("selected");
    } else {
        wantToGoBtn.classList.remove("selected");
    }

    if (status.beenHere) {
        beenHereBtn.classList.add("selected");
    } else {
        beenHereBtn.classList.remove("selected");
    }
};