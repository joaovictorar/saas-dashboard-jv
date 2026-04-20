const API = "https://saas-backend-q4qp.onrender.com";

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}

// REGISTER
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Register failed");
    }

    alert("User created successfully");
  } catch (error) {
    alert(error.message);
  }
}

async function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const res = await fetch(`${API}/dashboard`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to load dashboard");
    }

    const welcomeText = document.getElementById("welcome-text");
    const statsGrid = document.getElementById("stats-grid");
    const metricsTable = document.getElementById("metrics-table");

    if (welcomeText) {
      welcomeText.textContent = data.message;
    }

    if (statsGrid) {
      statsGrid.innerHTML = "";
      data.data.forEach((item) => {
        statsGrid.innerHTML += `
          <div class="stat-card">
            <h3>${item.name}</h3>
            <p>${item.value}</p>
          </div>
        `;
      });
    }

    if (metricsTable) {
      metricsTable.innerHTML = "";
      data.data.forEach((item) => {
        metricsTable.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>${item.value}</td>
          </tr>
        `;
      });
    }
  } catch (error) {
    alert(error.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

if (window.location.pathname.includes("dashboard")) {
  loadDashboard();
}