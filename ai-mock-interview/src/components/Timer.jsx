import { useEffect, useState } from "react";

export default function Timer({ duration, onTimeUp }) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time === 0) {
      onTimeUp();
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time]);

  return (
    <div className="px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
      ⏱ {time}s left
    </div>
  );
}
