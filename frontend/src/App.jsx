import React, { useState } from "react";
import Chat from "./Chat";
import ReportPage from "./ReportPage";

export default function App() {
  const [showReport, setShowReport] = useState(true);

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <header style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0, marginTop: 10, marginBottom: 4 }}>🌱 Silococene Blessing</h1>
        <p style={{ margin: 0, color: "#345", lineHeight: 1.6 }}>
          A gentle space to talk through worries about technology, the future, and how it all affects us. I’ll listen,
          reflect back, and offer small, practical steps to feel more grounded.
        </p>
        <div className="disclaimer" style={{ margin: "12px 0 0" }}>
          <strong>Wellbeing note:</strong> This is supportive information, not a medical service. If you feel unsafe or
          consider harming yourself or others, please contact local emergency services or a crisis hotline in your
          country immediately.
        </div>
      </header>

      <section>
        <Chat />
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: "#234" }}>Preview: Social Performance Canvas</h2>
          <button
            type="button"
            onClick={() => setShowReport((prev) => !prev)}
            style={{
              borderRadius: 999,
              border: "1px solid #1a8c75",
              background: showReport ? "#1aa37a" : "#f8fdfb",
              color: showReport ? "#fff" : "#16755c",
              padding: "6px 16px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {showReport ? "Hide canvas" : "Show canvas"}
          </button>
        </div>
        <p style={{ margin: 0, color: "#467", fontSize: 14 }}>
          A polished canvas that turns the raw metrics into an easy-to-present report. Use it as a client preview or to
          plan next steps.
        </p>
      </section>

      {showReport && <ReportPage />}
    </div>
  );
}

