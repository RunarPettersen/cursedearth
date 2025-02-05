import { registerUser, googleSignIn } from "../utils/authUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const usernameInput = document.getElementById("username");
    const messageElement = document.getElementById("registerMessage");
    const googleSignInBtn = document.getElementById("googleSignInBtn");

    if (!registerForm || !emailInput || !passwordInput || !usernameInput || !messageElement) {
        console.error("❌ Error: Missing form or input elements.");
        return;
    }

    // ✅ Handle Email/Password Registration
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const username = usernameInput.value.trim();

        if (!email || !password || !username) {
            showMessage("❌ All fields are required.", "error");
            return;
        }

        try {
            const result = await registerUser(email, password, username);
            showMessage(result.message, result.success ? "success" : "error");

            if (result.success) {
                setTimeout(() => {
                    window.location.href = "login.html"; // Redirect to login page
                }, 5000);
            }
        } catch (error) {
            console.error("❌ Registration error:", error);
            showMessage("❌ An unexpected error occurred. Please try again.", "error");
        }
    });

    // ✅ Google Sign-In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener("click", async () => {
            try {
                const result = await googleSignIn();
                if (result.success) {
                    window.location.href = result.redirect;
                } else {
                    showMessage(result.message, "error");
                }
            } catch (error) {
                console.error("❌ Google Sign-In error:", error);
                showMessage("❌ Google Sign-In failed. Try again.", "error");
            }
        });
    }

    // ✅ Function to Display Messages
    function showMessage(message, type) {
        messageElement.innerHTML = `<p class="${type}">${message}</p>`;
        messageElement.style.display = "block"; // Ensure message is visible
    }
});