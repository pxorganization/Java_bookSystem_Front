(() => {
  "use strict";

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
        //alert("User is authenticated");
      } else {
        console.error("Verification Failed");
        //alert("Invalid session, please log in again");
        window.location.href = "/pages/login.html";
      }
    } catch (error) {
      console.error("Network Error:", error);
      window.location.href = "/pages/login.html";
    }
  }

  window.onload = verifyUser;

  async function logout() {
    try {
      // Στέλνουμε αίτημα στον server για να διαγράψει το JWT και να τερματίσει το session
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // Για να διαγράψει το cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Ανακατεύθυνση στη σελίδα login
        window.location.href = "/pages/login.html";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  // Συνδέουμε το κουμπί logout με τη συνάρτηση
  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  });
})();
