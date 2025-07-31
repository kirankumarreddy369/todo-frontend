import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontSize: "1.2rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span role="img" aria-label="clock">🕒</span>
      {time.toLocaleTimeString()}
    </div>
  );
}