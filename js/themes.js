import { db } from "../js/constants/api.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const categorySection = document.getElementById("categorySection");
    
    if (!categorySection) {
        console.error("❌ Error: Category section not found.");
        return;
    }

    // ✅ Detect category from the URL
    const url = window.location.pathname;
    let category = "";
    if (url.includes("restaurants")) {
        category = "restaurant";
    } else if (url.includes("monuments")) {
        category = "monument";
    } else {
        categorySection.innerHTML = "<p>Error: Category not recognized.</p>";
        return;
    }

    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        let categoryDestinations = [];

        querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            if (data.category.includes(category)) {
                categoryDestinations.push(data);
            }
        });

        categorySection.innerHTML = "";

        if (categoryDestinations.length === 0) {
            categorySection.innerHTML = `<p>No destinations found in this category.</p>`;
            return;
        }

        categoryDestinations.forEach((data) => {
            const destinationDiv = document.createElement("div");
            destinationDiv.classList.add("place-item");
            destinationDiv.innerHTML = `
                <a href="../../discover/detail.html?id=${data.id}" class="destination-link">
                    <h3>${data.title}, ${data.country}</h3>
                    <img src="../../${data.image}" alt="${data.title}" class="place-image">
                    <p>${data.introduction}</p>
                </a>
            `;
            categorySection.appendChild(destinationDiv);
        });

    } catch (error) {
        console.error("❌ Error fetching category destinations:", error);
        categorySection.innerHTML = `<p>Error loading destinations. Please try again.</p>`;
    }
});
