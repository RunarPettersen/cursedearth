import { db } from "../js/constants/api.js"; // ✅ Import Firestore setup
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const auth = getAuth();

// ✅ Check if the user is logged in and an admin
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../login.html"; // Redirect to login if not logged in
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || !userSnap.data().isAdmin) {
        alert("❌ Access Denied: You are not an admin.");
        window.location.href = "../"; // Redirect to home page
        return;
    }

    console.log("✅ Admin Verified:", user.email);
});

// ✅ Logout Function
document.getElementById("logoutBtn").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "../login.html";
    });
});

// ✅ Add New Destination
document.getElementById('destinationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const introduction = document.getElementById('introduction').value.trim();
    const description = document.getElementById('description').value.trim();
    const where = document.getElementById('where').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const category = document.getElementById('category').value.split(',').map(item => item.trim());
    const tags = document.getElementById('tags').value.split(',').map(item => item.trim());
    const homepage = document.getElementById('homepage').value.trim();
    const darknessLevel = parseInt(document.getElementById('darknessLevel').value, 10);
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const image = document.getElementById('image').value.trim();
    const galleryPath = document.getElementById('galleryPath').value.trim();
    const galleryImages = document.getElementById('galleryImages').value.split(',').map(item => item.trim());
    const spotlight = document.getElementById('spotlight').checked;

    // ✅ Generate custom ID from title
    const formattedID = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();

    const newDestination = {
        title,
        introduction,
        description,
        where,
        address,
        city,
        country,
        category,
        tags,
        homepage: homepage || "",
        darknessLevel,
        latitude,
        longitude,
        image,
        galleryPath,
        galleryImages,
        spotlight,
        date: new Date().toISOString().split('T')[0] // Save current date
    };

    try {
        await setDoc(doc(db, "destinations", formattedID), newDestination); // ✅ Save with custom ID
        document.getElementById('message').innerHTML = `<p style="color:green;">✅ Destination Added Successfully! (${formattedID})</p>`;
        document.getElementById('destinationForm').reset();
    } catch (error) {
        console.error("❌ Error adding destination:", error);
        document.getElementById('message').innerHTML = `<p style="color:red;">❌ Error adding destination.</p>`;
    }
});