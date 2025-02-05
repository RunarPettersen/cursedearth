import { db } from "../constants/api.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const auth = getAuth();

/**
 * ✅ Save user's destination status (Been Here / Want to Go)
 */
export const saveUserDestinationStatus = async (destinationId, status) => {
    const user = auth.currentUser;

    if (!user) {
        console.warn("⚠️ User not logged in. Redirecting...");
        window.location.href = "../auth/login.html";
        return;
    }

    const userDocRef = doc(db, "user_destinations", user.uid);

    try {
        const userDocSnap = await getDoc(userDocRef);
        let userDestinations = userDocSnap.exists() ? userDocSnap.data() : {};

        // Ensure the user has an object in Firestore
        if (!userDestinations[status]) {
            userDestinations[status] = [];
        }

        // ✅ Toggle: If the destination is in the list, remove it
        if (userDestinations[status].includes(destinationId)) {
            userDestinations[status] = userDestinations[status].filter(id => id !== destinationId);
            console.log(`🚫 Removed "${destinationId}" from "${status}".`);
        } else {
            userDestinations[status].push(destinationId);
            console.log(`✅ Added "${destinationId}" to "${status}".`);
        }

        await setDoc(userDocRef, userDestinations, { merge: true });

        updateButtonStyles(destinationId);
        
    } catch (error) {
        console.error("❌ Error saving status:", error);
    }
};

/**
 * ✅ Check user's saved status for a destination
 */
export const getUserDestinationStatus = async (destinationId) => {
    const user = auth.currentUser;
    if (!user) return { wantToGo: false, beenHere: false };

    const userDocRef = doc(db, "user_destinations", user.uid);

    try {
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return { wantToGo: false, beenHere: false };
        }

        const userDestinations = userDocSnap.data();
        
        return {
            wantToGo: userDestinations.wantToGo?.includes(destinationId) || false,
            beenHere: userDestinations.beenHere?.includes(destinationId) || false
        };

    } catch (error) {
        console.error("❌ Error fetching user status:", error);
        return { wantToGo: false, beenHere: false };
    }
};

/**
 * ✅ Update button styles based on selection
 */
export const updateButtonStyles = async (destinationId) => {
    const status = await getUserDestinationStatus(destinationId);

    // ✅ Wait for DOM to update before selecting buttons
    setTimeout(() => {
        const wantToGoBtns = document.querySelectorAll(`.wantToGo-btn[data-id="${destinationId}"]`);
        const beenHereBtns = document.querySelectorAll(`.beenHere-btn[data-id="${destinationId}"]`);

        if (wantToGoBtns.length === 0 && beenHereBtns.length === 0) {
            console.warn(`⚠️ No buttons found for destination: ${destinationId}`);
            return; // ✅ Avoid running if buttons are missing
        }

        // ✅ Update "Want to Go" buttons
        wantToGoBtns.forEach(btn => {
            if (status.wantToGo) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        // ✅ Update "Been Here" buttons
        beenHereBtns.forEach(btn => {
            if (status.beenHere) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        console.log(`✅ Button styles updated for destination: ${destinationId}`);
    }, 100); // ✅ Small delay ensures buttons exist in the DOM
};

