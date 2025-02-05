import { loginUser, googleSignIn } from "../utils/authUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const messageElement = document.getElementById("loginMessage");
    const googleSignInBtn = document.getElementById("googleSignInBtn");

    if (!loginForm || !emailInput || !passwordInput || !messageElement) {
        console.error("❌ Error: Missing form or input elements.");
        return;
    }

    // ✅ Handle Email/Password Login
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showMessage("❌ Please enter both email and password.", "error");
            return;
        }

        try {
            const result = await loginUser(email, password);
            showMessage(result.message, result.success ? "success" : "error");

            if (result.success) {
                setTimeout(() => window.location.href = result.redirect, 2000);
            }
        } catch (error) {
            console.error("❌ Login error:", error);
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