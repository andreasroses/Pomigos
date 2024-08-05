import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          alert("Time's up!");
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setMinutes(25);
    setSeconds(0);
    setIsActive(false);
  };

  const saveSession = async () => {
    await axios.post('http://localhost:5000/session', {
      duration: 25 * 60 - (minutes * 60 + seconds)
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-6xl font-bold mb-4">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      <div className="space-x-4">
        <button onClick={toggle} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded">Reset</button>
        <button onClick={saveSession} disabled={isActive} className="px-4 py-2 bg-green-500 text-white rounded">
          Save Session
        </button>
      </div>
    </div>
  );
}

export default PomodoroTimer;
