import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyASIwVcfix2ePJR5sy-z_63uTUSZcbS_LU",
    authDomain: "cursed-earth.firebaseapp.com",
    projectId: "cursed-earth",
    storageBucket: "cursed-earth.appspot.com",
    messagingSenderId: "831111750860",
    appId: "1:831111750860:web:598aef5bc1c8315b768e69",
    measurementId: "G-JWN7J3SBE3"
};

// ✅ Initialize Firebase & Export Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };