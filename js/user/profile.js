import { setupLoader } from '../utils/loader.js';
import { loadUserData } from "./loadUserData.js";
import { setupEditProfile } from "./editProfile.js";
import { loadUserStatistics } from "./profileStats.js"; // ✅ Import Statistics Function

setupLoader();

document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    setupEditProfile();

    // ✅ Fetch User Statistics
    const userId = sessionStorage.getItem("userId"); // If you store user ID in sessionStorage
    if (userId) {
        loadUserStatistics(userId);
    }
});