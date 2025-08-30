import React, { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi, I’m Silococene Blessing. What’s on your mind about technology today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef(null);

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      const reply = data?.reply || "I’m here. Could you share a bit more?";
      setMessages(m => [...m, { role: "bot", text: reply }]);
    } catch (e) {
      setMessages(m => [
        ...m,
        { role: "bot", text: "⚠️ I couldn’t reach the server just now. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        ref={scroller}
        style={{
          background: "#f4faf9",
          border: "1px solid #cfe9e3",
          borderRadius: 12,
          padding: 12,
          minHeight: 320,
          maxHeight: 420,
          overflowY: "auto"
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              marginBottom: 10,
              justifyContent: m.role === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "8px 12px",
                borderRadius: 12,
                lineHeight: 1.45,
                background: m.role === "user" ? "#e7f6ef" : "#ffffff",
                border: m.role === "user" ? "1px solid #bfe2d8" : "1px solid #e6efed",
                color: "#173",
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
              }}
            >
              <strong style={{ color: "#127a5d" }}>
                {m.role === "user" ? "You" : "Silococene Blessing"}
              </strong>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your thought…"
          maxLength={1000}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #cfe9e3",
            outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid #0a7",
            background: loading ? "#a5d7c9" : "#16a085",
            color: "white",
            cursor: loading ? "default" : "pointer"
          }}
        >
          {loading ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
