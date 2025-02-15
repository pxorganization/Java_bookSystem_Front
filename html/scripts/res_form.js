document.addEventListener("DOMContentLoaded", async () => {
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
        console.log("Verification Success:", data);
        welcomeMessage.textContent = `Welcome, ${data.username}`;
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
        logoutBtn.style.display = "block";
      } else {
        console.error("Verification Failed");
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

  await verifyUser();
});
