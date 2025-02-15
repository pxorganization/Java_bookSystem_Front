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

logoutBtn.addEventListener("click", logout);

const planData = {
  tables: [
    { shape: "square-4", x: 300, y: 300, reserved: false },
    { shape: "square-4", x: 700, y: 300, reserved: false },
    { shape: "square-4", x: 1100, y: 300, reserved: false },
    { shape: "square-4", x: 300, y: 900, reserved: false },
    { shape: "square-4", x: 700, y: 900, reserved: false },
    { shape: "square-4", x: 1100, y: 900, reserved: false },
    { shape: "square-4", x: 300, y: 1500, reserved: false },
    { shape: "square-4", x: 700, y: 1500, reserved: false },
    { shape: "square-4", x: 1100, y: 1500, reserved: false },
    { shape: "square-4", x: 1500, y: 300, reserved: false },
    { shape: "square-4", x: 1500, y: 900, reserved: false },
    { shape: "square-4", x: 1500, y: 1500, reserved: false },
    { shape: "square-4", x: 1900, y: 300, reserved: false },
    { shape: "square-4", x: 1900, y: 900, reserved: false },
    { shape: "square-4", x: 1900, y: 1500, reserved: false },
    { shape: "square-4", x: 2300, y: 300, reserved: false },
    { shape: "square-4", x: 2300, y: 900, reserved: false },
    { shape: "square-4", x: 2300, y: 1500, reserved: false },
    { shape: "circle-4", x: 300, y: 2000, reserved: false },
    { shape: "circle-4", x: 900, y: 2000, reserved: false },
    { shape: "circle-4", x: 1500, y: 2000, reserved: false },
    { shape: "circle-4", x: 2100, y: 2000, reserved: false },
  ],
};

const chairSize = {
  width: 60,
  height: 60,
  outerWidth: 60,
  outerHeight: 60,
};

const tableData = {
  "square-4": {
    shape: "rect",
    width: 200,
    height: 200,
    chairPositions: [
      { x: 0, y: 0.5, angle: 0 },
      { x: 0.5, y: 0, angle: 90 },
      { x: 1, y: 0.5, angle: 180 },
      { x: 0.5, y: 1, angle: 270 },
    ],
  },
  "circle-4": {
    shape: "circle",
    radius: 120,
    chairPositions: [
      { x: 0, y: 0.5, angle: 0 },
      { x: 0.5, y: 0, angle: 90 },
      { x: 1, y: 0.5, angle: 180 },
      { x: 0.5, y: 1, angle: 270 },
    ],
  },
};

const stage = new Konva.Stage({
  container: "container",
  width: 800,
  height: 700,
  scaleX: 0.3,
  scaleY: 0.3,
  draggable: false,
});

const layer = new Konva.Layer();
stage.add(layer);

let selectedTable = null;

function drawTable(tableConfig) {
  const data = tableData[tableConfig.shape];
  const group = new Konva.Group({
    x: tableConfig.x,
    y: tableConfig.y,
    draggable: false,
  });

  let tableShape;
  if (data.shape === "rect") {
    tableShape = new Konva.Rect({
      x: -data.width / 2,
      y: -data.height / 2,
      width: data.width,
      height: data.height,
      stroke: "silver",
      strokeWidth: 4,
      fill: tableConfig.reserved ? "red" : "green",
    });
  } else {
    tableShape = new Konva.Circle({
      radius: data.radius,
      stroke: "silver",
      strokeWidth: 4,
      fill: tableConfig.reserved ? "red" : "green",
    });
  }

  group.add(tableShape);

  // Draw chairs
  const outerWidth = data.shape === "rect" ? data.width : data.radius * 2;
  const outerHeight = data.shape === "rect" ? data.height : data.radius * 2;
  const outerRect = {
    x: -outerWidth / 2 - chairSize.outerWidth / 2,
    y: -outerHeight / 2 - chairSize.outerHeight / 2,
    width: outerWidth + chairSize.outerWidth,
    height: outerHeight + chairSize.outerHeight,
  };

  data.chairPositions.forEach((chairPos) => {
    const chairGroup = new Konva.Group({
      x: outerRect.x + outerRect.width * chairPos.x,
      y: outerRect.y + outerRect.height * chairPos.y,
      rotation: chairPos.angle,
    });

    const chair = new Konva.Rect({
      width: chairSize.width,
      height: chairSize.height,
      offsetX: chairSize.width / 2,
      offsetY: chairSize.height / 2,
      stroke: "silver",
      strokeWidth: 4,
      fill: "transparent",
      cornerRadius: [0, 20, 20, 0],
    });

    chairGroup.add(chair);
    group.add(chairGroup);
  });

  // Add click handler to select and reserve table
  tableShape.on("click", function () {
    if (tableConfig.reserved) return;

    tableConfig.reserved = true;
    tableShape.fill("red");
    selectedTable = tableConfig;
    layer.draw();
  });

  layer.add(group);
}

// Draw all tables
planData.tables.forEach(drawTable);
layer.draw();

// Global object to store the reservation details
let reservationDetails = {
  people: null,
  time: null,
  date: null,
  table: null,
};

const peopleBtn = document.getElementById("people");
const timeBtn = document.getElementById("time");
const dateBtn = document.getElementById("calendar");
const pageBtn = document.getElementById("nextPageBtn");

// Function to update reservation details
function updateReservationDetails() {
  reservationDetails.people = peopleBtn.value;
  reservationDetails.time = timeBtn.value;
  reservationDetails.date = dateBtn.value;
}

// Event listeners for input changes
peopleBtn.addEventListener("change", function (event) {
  updateReservationDetails();
});

timeBtn.addEventListener("change", function (event) {
  updateReservationDetails();
});

dateBtn.addEventListener("change", function (event) {
  updateReservationDetails();
});

// Event listener for the "Next Step" button
pageBtn.addEventListener("click", function () {
  if (
    !reservationDetails.people ||
    !reservationDetails.time ||
    !reservationDetails.date
  ) {
    alert("Please fill in all the details and select a table.");
    return;
  }

  // Store the reservation details in localStorage
  localStorage.setItem(
    "reservationDetails",
    JSON.stringify(reservationDetails)
  );

  // Redirect to the next page
  window.location.href = "/pages/res_form.html"; // Change this to your actual next page URL
});
