"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  // Verify that the user is authenticated by calling a protected endpoint.
  // This endpoint (e.g., "/api/auth/me") should return user info if the JWT is valid.
  try {
    const response = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      credentials: "include", // Ensures the cookie is sent along with the request
    });
    if (!response.ok) {
      throw new Error("User not authenticated");
    }
    const userData = await response.json();
    // Update the header with the logged-in username
    const usernameSpan = document.querySelector(".user-info span");
    if (usernameSpan) {
      usernameSpan.textContent = userData.username;
    }
    // You may also check the user’s role here if needed.
    if (!userData.roles || !userData.roles.includes("Manager")) {
      // If the authenticated user is not a manager, redirect to an error page or login.
      alert("Access denied. Only managers are allowed.");
      window.location.href = "/pages/login.html";
      return;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    window.location.href = "/pages/login.html";
    return;
  }

  // Logout function: simply redirect to login (or call a logout API if available)
  window.logout = function () {
    // Optionally call a logout endpoint to invalidate the token on the server side.
    window.location.href = "/pages/login.html";
  };

  // Attach event listener to the Filter button.
  const filterButton = document.querySelector(".filter-container button");
  if (filterButton) {
    filterButton.addEventListener("click", applyFilters);
  }

  // Attach event listeners for Update and Cancel actions within the reservations table.
  const reservationsTable = document.querySelector(".reservations-table");
  if (reservationsTable) {
    reservationsTable.addEventListener("click", function (event) {
      if (event.target.tagName === "BUTTON") {
        const action = event.target.textContent.trim();
        if (action === "Update") {
          updateReservation(event.target);
        } else if (action === "Cancel") {
          cancelReservation(event.target);
        }
      }
    });
  }
});

function applyFilters() {
  // Read filter input values
  const name = document.querySelector(
    ".filter-container input[type='text']"
  ).value;
  const email = document.querySelector(
    ".filter-container input[type='email']"
  ).value;
  const phone = document.querySelector(
    ".filter-container input[type='tel']"
  ).value;
  const date = document.querySelector(
    ".filter-container input[type='date']"
  ).value;
  const time = document.querySelector(
    ".filter-container input[type='time']"
  ).value;

  console.log("Filter Values:", { name, email, phone, date, time });

  // TODO: Replace this with an API call that fetches filtered reservations.
  alert("Filtering functionality is not implemented yet.");
}

function updateReservation(button) {
  // Find the row containing the clicked button.
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");
  // Assume the cells are ordered: Name, Email, Phone, Date, Time, Actions.
  const reservation = {
    name: cells[0].textContent,
    email: cells[1].textContent,
    phone: cells[2].textContent,
    date: cells[3].textContent,
    time: cells[4].textContent,
  };
  console.log("Update reservation:", reservation);
  // TODO: Open a modal or redirect to a dedicated update page.
  alert("Update functionality is not implemented yet.");
}

function cancelReservation(button) {
  // Find the row containing the clicked button.
  const row = button.closest("tr");
  const cells = row.querySelectorAll("td");
  const reservation = {
    name: cells[0].textContent,
    email: cells[1].textContent,
    phone: cells[2].textContent,
    date: cells[3].textContent,
    time: cells[4].textContent,
  };
  console.log("Cancel reservation:", reservation);
  if (confirm("Are you sure you want to cancel this reservation?")) {
    // TODO: Call the API endpoint to cancel the reservation and update the table.
    alert("Cancellation functionality is not implemented yet.");
  }
}
