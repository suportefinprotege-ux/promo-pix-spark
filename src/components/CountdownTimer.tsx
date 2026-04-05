import React, { useState, useEffect } from "react";

const CountdownTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(185);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 299 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hrs = "00";
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="border border-white/50 text-white rounded px-2.5 py-1 text-xs font-bold whitespace-nowrap">
      TERMINA EM {hrs}:{mins}:{secs}
    </div>
  );
};

export default CountdownTimer;
