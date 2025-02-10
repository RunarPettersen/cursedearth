import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "../constants/api.js";
import { loadUserStatistics } from "./loadUserStatistics.js"; 

const auth = getAuth();
const userRef = (uid) => doc(db, "users", uid);

export const loadUserData = () => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = "../auth/login.html";
            return;
        }

        const usernameElement = document.getElementById("username");
        const userEmailElement = document.getElementById("userEmail");
        const userAvatarElement = document.getElementById("userAvatar");
        const joinedDateElement = document.getElementById("joinedDate");

        userEmailElement.textContent = user.email;
        usernameElement.textContent = "Loading...";

        if (user.photoURL) {
            userAvatarElement.src = user.photoURL;
        }

        const userDoc = await getDoc(userRef(user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            usernameElement.textContent = userData.username || "Anonymous";

            if (!user.photoURL) {
                userAvatarElement.src = userData.avatar || "../images/default-avatar.jpg";
            }

            if (userData.createdAt) {
                const joinedDate = new Date(userData.createdAt).toLocaleDateString();
                joinedDateElement.textContent = joinedDate;
            } else {
                joinedDateElement.textContent = "Unknown";
            }
        } else {
            usernameElement.textContent = "User";
        }

        loadUserStatistics(user.uid);
    });
};