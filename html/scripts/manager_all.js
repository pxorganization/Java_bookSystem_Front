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

  document.addEventListener("DOMContentLoaded", function () {
    loadReservations();
  });

  function loadReservations(filters = {}) {
    let url = new URL("http://localhost:8080/api/reservation/all");

    Object.keys(filters).forEach((key) => {
      if (filters[key]) url.searchParams.append(key, filters[key]);
    });

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const table = document.getElementById("reservationsTable");
        table.innerHTML = `
                <tr>
                    <th>Table Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                </tr>
            `;

        data.forEach((reservation) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>${reservation.tableNumber || "N/A"}</td>
                    <td>${reservation.name}</td>
                    <td>${reservation.email}</td>
                    <td>${reservation.phone}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>
                        <button class="update-btn" onclick="updateReservation(${
                          reservation.id
                        })">Update</button>
                        <button class="cancel-btn" onclick="cancelReservation(${
                          reservation.id
                        })">Cancel</button>
                    </td>
                `;
          table.appendChild(row);
        });
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }

  function applyFilters() {
    const filters = {
      name: document.getElementById("user_name").value,
      email: document.getElementById("email_address").value,
      phone: document.getElementById("telephone").value,
      date: document.getElementById("date_resv").value,
      time: document.getElementById("date_time").value,
    };

    loadReservations(filters);
  }

  // Functions for update and cancel actions
  function updateReservation(id) {
    alert(`Update reservation with ID: ${id}`);
    // TODO: Implement update logic
  }

  function cancelReservation(id) {
    alert(`Cancel reservation with ID: ${id}`);
    // TODO: Implement cancel logic
  }
})();
