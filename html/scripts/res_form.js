"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  await verifyUser();
});
const reservationDetails = JSON.parse(
  localStorage.getItem("reservationDetails")
);

const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const formBtn = document.getElementById("confirmForm");

let id;
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

      welcomeMessage.textContent = `Welcome, ${data.user.username}`;
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";
      logoutBtn.style.display = "block";
    } else {
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

async function reservationFields() {
  const people = reservationDetails.people;
  const tableNumber = 12;
  const date = reservationDetails.date;
  const time = reservationDetails.time;
  const surname = document.getElementById("surname").value.trim();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const notes = document.getElementById("notes").value.trim();

  const fields = {
    tableNumber: tableNumber,
    people: people,
    surname: surname,
    name: name,
    phone: phone,
    email: email,
    notes: notes,
    date: date,
    time: time,
  };

  console.log("Fields being sent:", fields);
  await confirm(fields);
}

async function confirm(fields) {
  try {
    const response = await fetch(
      "http://localhost:8080/api/reservation/savereservation",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      }
    );
    if (response.ok) {
      console.log("Fetched correct");
    } else {
      console.log("Fetched wrong");
    }
  } catch (error) {
    console.error(error);
  }
}

logoutBtn.addEventListener("click", logout);

formBtn.addEventListener("submit", async function (event) {
  event.preventDefault();
  await reservationFields();
});
