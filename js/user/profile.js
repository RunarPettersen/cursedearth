import { setupLoader } from '../utils/loader.js';
import { loadUserData } from "./loadUserData.js";
import { setupEditProfile } from "./editProfile.js";

setupLoader();

document.addEventListener("DOMContentLoaded", () => {
    loadUserData();
    setupEditProfile();
});