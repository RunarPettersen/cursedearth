import { logoutUser } from "../utils/authUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) {
        console.warn("⚠️ Logout button not found.");
        return;
    }

    logoutBtn.addEventListener("click", async () => {
        const result = await logoutUser();
        if (result.success) {
            window.location.href = "../auth/login.html"; // Redirect to login page
        } else {
            console.error(result.message);
        }
    });
});