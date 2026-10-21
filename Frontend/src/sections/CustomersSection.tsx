import { useEffect, useState } from "react";
import { getCustomers } from "../api";
import { getItem } from "../storage";
import type { Customer } from "../types/api";

// "Discriminated union": o campo `status` diz qual dos formatos o estado
// tem. Dentro de `if (state.status === "error")` o TS sabe que existe
// `state.message`, e em "success" sabe que existe `state.customers`.
type CustomersState =
  | { status: "loading" }
  | { status: "success"; customers: Customer[] }
  | { status: "error"; message: string };

export default function CustomersSection() {
  const [state, setState] = useState<CustomersState>({ status: "loading" });

  useEffect(() => {
    const token = getItem("token");
    if (!token) return;

    // Evita atualizar o estado se o componente desmontar antes da resposta
    let ignore = false;

    getCustomers(token)
      .then((customers) => {
        if (!ignore) setState({ status: "success", customers });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        if (!ignore) setState({ status: "error", message });
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="content-section active-section">
      <header className="topbar">
        <div>
          <h1>Customers</h1>
          <p>Manage your customer base.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Customer List</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.status === "loading" && (
                <tr>
                  <td colSpan={4}>Loading customers...</td>
                </tr>
              )}

              {state.status === "error" && (
                <tr>
                  <td colSpan={4}>{state.message}</td>
                </tr>
              )}

              {state.status === "success" &&
                state.customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.email}</td>
                    <td>{customer._id ? customer._id.slice(-6) : "N/A"}</td>
                    <td>Free</td>
                    <td>Active</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
