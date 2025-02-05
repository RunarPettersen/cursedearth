import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyASIwVcfix2ePJR5sy-z_63uTUSZcbS_LU",
  authDomain: "cursed-earth.firebaseapp.com",
  projectId: "cursed-earth",
  storageBucket: "cursed-earth.appspot.com",
  messagingSenderId: "831111750860",
  appId: "1:831111750860:web:598aef5bc1c8315b768e69",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Handle File Upload
document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
        alert("Please select a JSON file.");
        return;
    }

    // ✅ Read JSON File
    const reader = new FileReader();
    reader.onload = async function (event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            const destinations = jsonData.destinations;

            // ✅ Upload to Firestore
            for (const [id, data] of Object.entries(destinations)) {
                await setDoc(doc(db, "destinations", id), data);
                console.log(`✅ Uploaded: ${data.title}`);
            }

            alert("🎉 All destinations uploaded successfully!");
        } catch (error) {
            console.error("❌ Error uploading:", error);
            alert("Error uploading JSON. Check console for details.");
        }
    };

    reader.readAsText(fileInput);
});
