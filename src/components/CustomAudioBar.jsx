import React, { useRef, useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon
} from '../assets/icons'
import { calculateTime } from "../functions";

const CustomAudioBar = ({ src, controlsList }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    audioPlayer.current.onloadedmetadata = () => {
      if (audioPlayer?.current?.duration) {
        if (audioPlayer.current.duration === Infinity) {
          audioPlayer.current.currentTime = Number.MAX_SAFE_INTEGER;
          audioPlayer.current.ontimeupdate = () => {
            audioPlayer.current.ontimeupdate = null;
            const seconds = Math.floor(audioPlayer.current.duration);
            setDuration(seconds);
            progressBar.current.max = seconds;
            audioPlayer.current.currentTime = 0;
          };
        }
        // Normal behavior
        else {
          const seconds = Math.floor(audioPlayer.current.duration);
          setDuration(seconds);
          progressBar.current.max = seconds;
        }
      }
    };
    audioPlayer.current.onerror = (event) => console.log(event.target.error);

    audioPlayer.current.onended = () => {
      setIsPlaying(false);
    };
  }, []);

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  return (
    <div className="audio-player">
      {src && (
        <>
          <audio ref={audioPlayer} controlsList={controlsList}>
            <source src={src} />
          </audio>

          <button className="play-pause" onClick={() => togglePlayPause()}>
            {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
          </button>
          <div className="current-time">{calculateTime(currentTime)}</div>

          <div>
            <input
              ref={progressBar}
              className="progress-bar"
              type="range"
              defaultValue="0"
              onChange={changeRange}
            />
          </div>

          <div className="duration">
            {Number.isInteger(duration) ? calculateTime(duration) : ""}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomAudioBar;
