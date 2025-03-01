(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Invalid email or password");
        }

        const userData = await response.json();

        if (userData.role == "MANAGER") {
          //alert(`Welcome, ${userData.username} with Role: ${userData.role}!`);
          window.location.href = "/pages/manager_dash.html";
        } else {
          //alert(`Welcome, ${userData.username} with Role: ${userData.role}!`);
          window.location.href = "/pages/selection.html";
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      }
    });
  });
})();
