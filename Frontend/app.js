const API = "https://saas-backend-q4qp.onrender.com";

let revenueChartInstance = null;

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

function renderChart() {
  const ctx = document.getElementById("revenueChart");

  if (!ctx) return;

  if (revenueChartInstance) {
    revenueChartInstance.destroy();
  }

  revenueChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [400, 650, 800, 720, 1100, 1200],
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.15)",
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#f8fafc"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#94a3b8"
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        },
        y: {
          ticks: {
            color: "#94a3b8"
          },
          grid: {
            color: "rgba(255,255,255,0.06)"
          }
        }
      }
    }
  });
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

    renderChart();
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