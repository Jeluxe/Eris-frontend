import { useEffect, useMemo, useRef, useState } from "react";

export const useRecorder = () => {
  const streamRef = useRef();
  const mediaRecorderRef = useRef();
  const timeoutId = useRef();
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId.current);
      mediaRecorderRef.current?.state !== "inactive" && mediaRecorderRef?.current?.stop();
    };
  }, []);

  const createRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = {
        audioBitsPerSecond: 128000,
      };

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        setBlob(event.data);
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const startRecording = async () => {
    await createRecorder();
    mediaRecorderRef.current.start();
    timeoutId.current = setTimeout(() => {
      stopRecording();
    }, 1000 * 60);
  };

  const stopRecording = () => {
    clearTimeout(timeoutId.current);
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
  };

  const url = useMemo(() => {
    return blob ? URL.createObjectURL(blob) : null;
  }, [blob]);

  return { startRecording, stopRecording, url, blob, setBlob };
};