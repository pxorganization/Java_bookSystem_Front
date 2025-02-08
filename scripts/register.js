"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.querySelector("form");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const repPassword = document.getElementById("rep_password").value;
    const birthyear = document.getElementById("birthyear").value;
    const termsAccepted = document.getElementById("terms").checked;

    // Validate password confirmation
    if (password !== repPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      alert("You must agree to the Terms and Privacy Policy.");
      return;
    }

    // Build the user data object. (Backend expects a User object with these fields.)
    const userData = {
      username: username,
      email: email,
      password: password,
      birthyear: birthyear,
    };

    try {
      // Make a POST request to the registration endpoint
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Registration failed");
      }

      const data = await response.json();
      alert("Registration successful! You can now log in.");
      // Optionally, redirect the user to the login page:
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed: " + error.message);
    }
  });
});
