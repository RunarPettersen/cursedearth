import { db } from "../js/constants/api.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ✅ Get Destination ID from URL
const urlParams = new URLSearchParams(window.location.search);
const destinationId = urlParams.get("id");

// ✅ Get Form Elements
const editForm = document.getElementById("editForm");
const titleInput = document.getElementById("title");
const introductionInput = document.getElementById("introduction");
const descriptionInput = document.getElementById("description");
const whereInput = document.getElementById("where");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");
const categoryInput = document.getElementById("category");
const tagsInput = document.getElementById("tags");
const homepageInput = document.getElementById("homepage");
const darknessLevelInput = document.getElementById("darknessLevel");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const imageInput = document.getElementById("image");
const galleryPathInput = document.getElementById("galleryPath");
const galleryImagesInput = document.getElementById("galleryImages");
const spotlightCheckbox = document.getElementById("spotlight"); // ✅ Spotlight Checkbox
const editMessage = document.getElementById("editMessage");

// ✅ Load Existing Destination Data
const loadDestinationData = async () => {
    if (!destinationId) {
        editMessage.innerHTML = "<p class='error'>❌ No destination ID found.</p>";
        return;
    }

    try {
        const docRef = doc(db, "destinations", destinationId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            editMessage.innerHTML = "<p class='error'>❌ Destination not found.</p>";
            return;
        }

        const data = docSnap.data();
        titleInput.value = data.title || "";
        introductionInput.value = data.introduction || "";
        descriptionInput.value = data.description || "";
        whereInput.value = data.where || "";
        addressInput.value = data.address || "";
        cityInput.value = data.city || "";
        countryInput.value = data.country || "";
        categoryInput.value = data.category ? data.category.join(", ") : "";
        tagsInput.value = data.tags ? data.tags.join(", ") : "";
        homepageInput.value = data.homepage || "";
        darknessLevelInput.value = data.darknessLevel || "";
        latitudeInput.value = data.latitude || "";
        longitudeInput.value = data.longitude || "";
        imageInput.value = data.image || "";
        galleryPathInput.value = data.galleryPath || "";
        galleryImagesInput.value = data.galleryImages ? data.galleryImages.join(", ") : "";

        // ✅ Set Spotlight Checkbox Based on Firestore Data
        spotlightCheckbox.checked = data.spotlight || false;

        console.log("✅ Destination loaded:", data);
    } catch (error) {
        console.error("❌ Error loading destination:", error);
    }
};

// ✅ Handle Form Submission
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const updatedData = {
            title: titleInput.value.trim(),
            introduction: introductionInput.value.trim(),
            description: descriptionInput.value.trim(),
            where: whereInput.value.trim(),
            address: addressInput.value.trim(),
            city: cityInput.value.trim(),
            country: countryInput.value.trim(),
            category: categoryInput.value.split(",").map(item => item.trim()),
            tags: tagsInput.value.split(",").map(item => item.trim()),
            homepage: homepageInput.value.trim(),
            darknessLevel: parseInt(darknessLevelInput.value, 10),
            latitude: parseFloat(latitudeInput.value),
            longitude: parseFloat(longitudeInput.value),
            image: imageInput.value.trim(),
            galleryPath: galleryPathInput.value.trim(),
            galleryImages: galleryImagesInput.value.split(",").map(item => item.trim()),

            // ✅ Save Spotlight status
            spotlight: spotlightCheckbox.checked,
        };

        const docRef = doc(db, "destinations", destinationId);
        await updateDoc(docRef, updatedData);

        editMessage.innerHTML = "<p class='success'>✅ Destination updated successfully!</p>";
        console.log("✅ Destination updated:", updatedData);
    } catch (error) {
        console.error("❌ Error updating destination:", error);
        editMessage.innerHTML = "<p class='error'>❌ Error updating destination.</p>";
    }
});

// ✅ Load Data on Page Load
document.addEventListener("DOMContentLoaded", loadDestinationData);
