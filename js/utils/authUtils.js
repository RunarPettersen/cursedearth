import { auth, db, googleProvider } from "./firebaseConfig.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

/** 
 * ✅ Register New User (Email & Password)
 * @param {string} email
 * @param {string} password
 * @param {string} username
 */
export const registerUser = async (email, password, username) => {
    try {
        // ✅ Create User in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: email,
            username: username || "Anonymous",
            isAdmin: false, // Admins must be manually set in Firestore
            createdAt: new Date().toISOString()
        });

        // ✅ Send Email Verification
        await sendEmailVerification(user);

        console.log("✅ User registered & stored in Firestore:", user);
        return { success: true, message: "✅ Account created! Check your email for verification." };
    } catch (error) {
        console.error("❌ Registration failed:", error);
        return { success: false, message: getAuthErrorMessage(error.code) };
    }
};

/**
 * ✅ Login User (Email & Password)
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            return { success: false, message: "❌ Please verify your email before logging in." };
        }

        console.log("✅ Login successful:", user);
        return { success: true, redirect: "../discover/" };
    } catch (error) {
        console.error("❌ Login failed:", error);
        return { success: false, message: getAuthErrorMessage(error.code) };
    }
};

/**
 * ✅ Google Sign-In
 */
export const googleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // ✅ Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // ✅ Store Google user in Firestore (Default: Not Admin)
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                username: user.displayName || "Anonymous",
                isAdmin: false,
                createdAt: new Date().toISOString()
            });
        }

        console.log("✅ Google Sign-In Successful:", user);
        return { success: true, redirect: "../discover/" };
    } catch (error) {
        console.error("❌ Google Sign-In Failed:", error);
        return { success: false, message: "Google Sign-In failed. Try again." };
    }
};

/**
 * ✅ Logout User
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("✅ User logged out");
        return { success: true, message: "✅ Successfully logged out!" };
    } catch (error) {
        console.error("❌ Logout failed:", error);
        return { success: false, message: "❌ Logout failed. Try again." };
    }
};

/**
 * ✅ Convert Firebase Auth Errors to User-Friendly Messages
 * @param {string} errorCode
 */
const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "❌ This email is already in use.";
        case "auth/user-not-found":
            return "❌ No account found with this email.";
        case "auth/wrong-password":
            return "❌ Incorrect password. Try again.";
        case "auth/too-many-requests":
            return "❌ Too many failed attempts. Try again later.";
        case "auth/invalid-email":
            return "❌ Invalid email format. Please check your email.";
        default:
            return "❌ Authentication failed. Please try again.";
    }
};