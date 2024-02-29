import { useCallback, useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from '../assets/icons';
import { calculateTime } from "../functions";

const CustomAudioBar = ({ src, controlsList }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    setupEventListeners();
    return () => {
      removeEventListeners();
    };
  }, []);

  const setupEventListeners = () => {
    audioPlayer.current.onloadedmetadata = handleLoadedMetadata;
    audioPlayer.current.onerror = handleError;
    audioPlayer.current.onpause = handlePause;
    audioPlayer.current.onended = handleEnded;
  };

  const removeEventListeners = () => {
    cancelAnimationFrame(animationRef.current);
  };

  const handleLoadedMetadata = () => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(Number.isFinite(seconds) ? seconds : 0);
    progressBar.current.max = seconds;
  };

  const handleError = (event) => {
    console.error(event.target.error);
    // Handle error gracefully
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };


  const togglePlayPause = useCallback(() => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      const audioPlayers = document.querySelectorAll('.audio-player audio');
      audioPlayers.forEach(player => (player !== audioPlayer.current) ? player.pause() : "");
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  }, [isPlaying]);

  const whilePlaying = useCallback(() => {
    if (audioPlayer.current) {
      progressBar.current.value = audioPlayer.current.currentTime;
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, []);

  const changeRange = useCallback(() => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  }, []);

  const changePlayerCurrentTime = useCallback(() => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  }, [duration]);

  return (
    <div className="audio-player">
      {src && (
        <>
          <audio ref={audioPlayer} controlsList={controlsList} src={src} />

          <button className="play-pause" onClick={togglePlayPause}>
            {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
          </button>
          <div className="current-time">{calculateTime(currentTime)}</div>

          <div className="progress-bar-wrapper">
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
