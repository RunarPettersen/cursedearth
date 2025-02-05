import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// ✅ Export Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyASIwVcfix2ePJR5sy-z_63uTUSZcbS_LU",
    authDomain: "cursed-earth.firebaseapp.com",
    projectId: "cursed-earth",
    storageBucket: "cursed-earth.appspot.com",
    messagingSenderId: "831111750860",
    appId: "1:831111750860:web:598aef5bc1c8315b768e69",
    measurementId: "G-JWN7J3SBE3"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Export Firebase Modules
export { app, db, auth };
