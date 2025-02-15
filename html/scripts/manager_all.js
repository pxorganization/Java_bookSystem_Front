"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
  await loadReservations();
  setupEventListeners();
});

const welcomeMessage = document.getElementById("welcome-message");

//  Σύνδεση event listeners
function setupEventListeners() {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const filterBtn = document.getElementById("applyFiltersBtn");
  if (filterBtn) filterBtn.addEventListener("click", applyFilters);
}

//  Επαλήθευση χρήστη
async function verifyUser() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/verify", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      welcomeMessage.textContent = `Welcome, ${data.user.username}`;
    } else {
      console.error("Verification Failed");
      window.location.href = "/pages/login.html";
    }
  } catch (error) {
    console.error("Network Error:", error);
    window.location.href = "/pages/login.html";
  }
}

//  Logout χρήστη
async function logout() {
  try {
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
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

//  Φόρτωση κρατήσεων
async function loadReservations(filters = {}) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/allfilters",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch reservations");

    const data = await response.json();
    renderReservationsTable(data);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
}

//  Εμφάνιση κρατήσεων στον πίνακα
function renderReservationsTable(reservations) {
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

  reservations.forEach((reservation) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${reservation.tableNumber}</td>
        <td>${reservation.name}</td>
        <td>${reservation.email}</td>
        <td>${reservation.phone}</td>
        <td>${reservation.date}</td>
        <td>${reservation.time}</td>
        <td>
          <button class="update-btn" data-id="${reservation.id}">Update</button>
          <button class="cancel-btn" data-id="${reservation.id}">Cancel</button>
        </td>
      `;
    table.appendChild(row);
  });

  attachTableEventListeners();
}

//  Εφαρμογή φίλτρων
async function applyFilters() {
  const filters = {
    tableNumber: document.getElementById("table_number").value,
    name: document.getElementById("user_name").value,
    email: document.getElementById("email_address").value,
    phone: document.getElementById("telephone").value,
    date: document.getElementById("date_resv").value,
    time: document.getElementById("date_time").value,
  };

  console.log("Filters:", filters);

  await loadReservations(filters);
}

//  Σύνδεση event listeners στα κουμπιά του πίνακα
function attachTableEventListeners() {
  document.querySelectorAll(".update-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateReservation(btn.dataset.id));
  });

  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", () => cancelReservation(btn.dataset.id));
  });
}

// ✅ Update κράτησης
async function updateReservation(id) {
  alert(`Update reservation with ID: ${id}`);
  // TODO: Implement update logic
}

// ✅ Cancel κράτησης
async function cancelReservation(id) {
  alert(`Cancel reservation with ID: ${id}`);
  // TODO: Implement cancel logic
}
