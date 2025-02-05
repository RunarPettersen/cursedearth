import { getAuth, onAuthStateChanged, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "../constants/api.js";

const auth = getAuth();
const userRef = (uid) => doc(db, "users", uid);

document.addEventListener("DOMContentLoaded", () => {
    const usernameElement = document.getElementById("username");
    const userEmailElement = document.getElementById("userEmail");
    const userAvatarElement = document.getElementById("userAvatar");
    const editProfileBtn = document.getElementById("editProfileBtn");
    const editProfileForm = document.getElementById("editProfileForm");
    const newUsernameInput = document.getElementById("newUsername");
    const newAvatarInput = document.getElementById("newAvatar");
    const saveProfileBtn = document.getElementById("saveProfileBtn");

    // ✅ Load User Data
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "../auth/login.html"; // Redirect if not logged in
            return;
        }

        userEmailElement.textContent = user.email;
        usernameElement.textContent = "Loading...";
        userAvatarElement.src = user.photoURL || "../images/default-avatar.jpg";

        // Fetch user details from Firestore
        const userDoc = await getDoc(userRef(user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            usernameElement.textContent = userData.username || "Anonymous";
            userAvatarElement.src = userData.avatar || "../images/default-avatar.jpg";
        } else {
            usernameElement.textContent = "User";
        }

        // ✅ Load "Want to go" and "Been Here" statistics
        loadUserStatistics(user.uid);
    });

    // ✅ Show Edit Profile Form
    editProfileBtn.addEventListener("click", () => {
        editProfileForm.classList.toggle("hidden");
    });

    // ✅ Save Updated Profile Info
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

            if (newUsername) usernameElement.textContent = newUsername;
            if (newAvatar) userAvatarElement.src = newAvatar;

            alert("✅ Profile updated!");
            editProfileForm.classList.add("hidden");

        } catch (error) {
            console.error("❌ Error updating profile:", error);
        }
    });
});

// ✅ Fetch "Want to go" & "Been Here" Count
const loadUserStatistics = async (uid) => {
    try {
        const userDocRef = doc(db, "user_destinations", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const wantToGoCount = userData.wantToGo ? userData.wantToGo.length : 0;
            const beenHereCount = userData.beenHere ? userData.beenHere.length : 0;

            document.getElementById("wantToGoCount").textContent = wantToGoCount;
            document.getElementById("beenHereCount").textContent = beenHereCount;
        } else {
            console.warn("⚠️ No user destinations found.");
            document.getElementById("wantToGoCount").textContent = "0";
            document.getElementById("beenHereCount").textContent = "0";
        }

    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
    }
};