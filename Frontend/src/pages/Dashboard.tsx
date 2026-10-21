import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../api";
import AnalyticsSection from "../sections/AnalyticsSection";
import CustomersSection from "../sections/CustomersSection";
import OverviewSection from "../sections/OverviewSection";
import SettingsSection from "../sections/SettingsSection";
import { clearSession, getItem } from "../storage";
import type { DashboardResponse } from "../types/api";

// Union de strings literais: só estes 4 valores são aceitos.
type SectionId = "dashboard" | "analytics" | "customers" | "settings";

const navItems: { id: SectionId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "analytics", label: "Analytics" },
  { id: "customers", label: "Customers" },
  { id: "settings", label: "Settings" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState<SectionId>("dashboard");
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    document.title = "Dashboard | JV SaaS";
  }, []);

  useEffect(() => {
    const token = getItem("token");
    if (!token) return;

    let ignore = false;

    getDashboard(token)
      .then((data) => {
        if (!ignore) setDashboard(data);
      })
      .catch((error: unknown) => {
        if (!ignore) alert(error instanceof Error ? error.message : String(error));
      });

    return () => {
      ignore = true;
    };
  }, []);

  function handleNavClick(e: MouseEvent<HTMLAnchorElement>, id: SectionId) {
    e.preventDefault();
    setActive(id);
  }

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <div className="brand">JV SaaS</div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <a
                href="#"
                key={item.id}
                className={item.id === active ? "nav-link active" : "nav-link"}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main">
        {active === "dashboard" && <OverviewSection dashboard={dashboard} />}
        {active === "analytics" && <AnalyticsSection />}
        {active === "customers" && <CustomersSection />}
        {active === "settings" && <SettingsSection />}
      </main>
    </div>
  );
}
