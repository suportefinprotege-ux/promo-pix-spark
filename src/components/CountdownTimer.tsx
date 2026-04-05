import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [seconds, setSeconds] = useState(299); // 4:59

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s <= 0 ? 299 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 bg-foreground text-primary-foreground rounded-md px-3 py-1.5 text-sm font-semibold">
      <span>⚡ Oferta Relâmpago</span>
      <span className="ml-auto font-mono">
        00:{mins}:{secs}
      </span>
    </div>
  );
};

export default CountdownTimer;
