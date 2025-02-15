"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
});

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const welcomeMessage = document.getElementById("welcome-message");

async function verifyUser() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("authorized");
      console.log("Backend Response:", data.message);
      console.log("User Information:", data);

      welcomeMessage.textContent = `Welcome, ${data.user.username}`;
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
      console.log("Unauthorized");
      loginBtn.style.display = "block";
      registerBtn.style.display = "block";
      logoutBtn.style.display = "none";
      welcomeMessage.textContent = "";
    }
  } catch (error) {
    console.error("Network Error:", error);
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    logoutBtn.style.display = "none";
    welcomeMessage.textContent = "";
  }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "/pages/login.html";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}

logoutBtn.addEventListener("click", logout);
