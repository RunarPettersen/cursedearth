import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { db } from "../constants/api.js"; // Import Firestore setup

const auth = getAuth();

// ✅ Check if user is authenticated
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.warn("⚠️ User not logged in. Redirecting...");
        window.location.href = "../auth/login.html"; // Redirect to login page
        return;
    }

    console.log("✅ User authenticated:", user.email);

    // ✅ Check if user is an admin (optional, for admin pages)
    if (window.location.pathname.includes("/admin/")) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists() && userSnap.data().isAdmin) {
                console.log("✅ User is an admin.");
            } else {
                console.warn("⛔ Unauthorized! Redirecting...");
                window.location.href = "../"; // Redirect to home page
            }
        } catch (error) {
            console.error("❌ Error checking admin status:", error);
            window.location.href = "../"; // Redirect if error occurs
        }
    }
});
