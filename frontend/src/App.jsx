import React from "react";
import Chat from "./Chat";

export default function App() {
  return (
    <div>
      <h1 style={{ marginTop: 10, marginBottom: 6 }}>🌱 Silococene Blessing</h1>
      <p style={{ marginTop: 0, color: "#345", lineHeight: 1.5 }}>
        A gentle space to talk through worries about technology, the future, and how it all affects us.
        I’ll listen, reflect back, and offer small, practical steps to feel more grounded.
      </p>

      <div className="disclaimer" style={{ margin: "12px 0 18px" }}>
        <strong>Wellbeing note:</strong> This is supportive information, not a medical service. If you feel
        unsafe or consider harming yourself or others, please contact local emergency services or a crisis
        hotline in your country immediately.
      </div>

      <Chat />
    </div>
  );
}
