import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "../constants/api.js";

const auth = getAuth();
const userRef = (uid) => doc(db, "users", uid);

export const setupEditProfile = () => {
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileForm = document.getElementById("editProfileForm");
    const newUsernameInput = document.getElementById("newUsername");
    const newAvatarInput = document.getElementById("newAvatar");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    editProfileBtn.addEventListener("click", () => {
        editProfileForm.classList.toggle("hidden");
    });

    saveProfileBtn.addEventListener("click", async () => {
        const newUsername = newUsernameInput.value.trim();
        const newAvatar = newAvatarInput.value.trim();

        if (!newUsername && !newAvatar) {
            alert("Enter new username or avatar URL to update.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) return;

            const updates = {};
            if (newUsername) updates.username = newUsername;
            if (newAvatar) updates.avatar = newAvatar;

            await updateDoc(userRef(user.uid), updates);

            if (newUsername) document.getElementById("username").textContent = newUsername;
            if (newAvatar) document.getElementById("userAvatar").src = newAvatar;

            alert("✅ Profile updated!");
            editProfileForm.classList.add("hidden");

        } catch (error) {
            console.error("❌ Error updating profile:", error);
        }
    });
};