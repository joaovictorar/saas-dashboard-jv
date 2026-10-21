import { useState, type FormEvent } from "react";
import { getItem, setItem } from "../storage";

export default function SettingsSection() {
  // Função no useState: lê o localStorage só na primeira renderização
  const [name, setName] = useState(() => getItem("userName") ?? "João Victor");
  const [email, setEmail] = useState(() => getItem("userEmail") ?? "");
  const [message, setMessage] = useState("");

  // FormEvent<HTMLFormElement>: tipo do evento de submit de um <form>
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setItem("userEmail", email.trim());
    setItem("userName", name.trim());

    setMessage("Settings saved successfully.");
  }

  return (
    <section className="content-section active-section">
      <header className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Update your account preferences.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Profile Settings</h2>
        </div>

        <form className="settings-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="save-btn">Save Changes</button>
        </form>

        <p className="settings-message">{message}</p>
      </section>
    </section>
  );
}
