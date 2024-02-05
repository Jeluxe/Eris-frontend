import { useEffect, useState } from 'react'

export const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const handleReset = () => {
    setTimer(0);
    setIsRunning(false);
  };

  return { timer, isRunning, handleStartStop, handleReset };
}
