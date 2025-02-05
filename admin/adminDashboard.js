import { db } from "../js/constants/api.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const loadDestinations = async () => {
    const tableBody = document.querySelector("#destinationTable tbody");

    try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        tableBody.innerHTML = "";

        querySnapshot.forEach(docSnapshot => {
            const data = docSnapshot.data();
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.title}</td>
                <td>${data.category.join(", ")}</td>
                <td>
                    <a href="edit.html?id=${docSnapshot.id}" class="edit-btn">Edit</a>
                    <button class="delete-btn" data-id="${docSnapshot.id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // ✅ Attach Delete Functionality
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (e) => {
                const destinationId = e.target.getAttribute("data-id");
                if (confirm("Are you sure you want to delete this destination?")) {
                    await deleteDoc(doc(db, "destinations", destinationId));
                    loadDestinations(); // Refresh the list
                }
            });
        });

    } catch (error) {
        console.error("❌ Error fetching destinations:", error);
    }
};

document.addEventListener("DOMContentLoaded", loadDestinations);
