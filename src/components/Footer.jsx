import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { SendIcon, TrashIcon } from '../assets/icons';
import { useSocketIOProvider, useStateProvider } from '../context';
import { blobToBuffer, calculateTime } from '../functions';
import { useRecorder, useTimer } from '../hooks';
import { CustomAudioBar, Textarea } from './';

const style = (condition) => {
  return {
    flexDirection: condition ? "column" : ""
  }
}

const Footer = () => {
  const params = useParams()
  const navigate = useNavigate();
  const { setRooms, setMessages, selectedRoom } = useStateProvider();
  const { emitData } = useSocketIOProvider();
  const { startRecording, stopRecording, url, blob, setBlob } = useRecorder();
  const { timer, isRunning, handleStartStop, handleReset } = useTimer();
  const [preview, setPreview] = useState(false);
  const [recording, setRecording] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState("")

  useEffect(() => {
    return () => {
      reset()
      recordReset()
    }
  }, [params])

  const toggleRecord = () => {
    setDisabled(true);
    handleStartStop()
    if (!recording) {
      startRecording();
      setRecording(true);
    } else {
      stopRecording();
      setRecording(false);
      setPreview(true);
    }
  };

  const reset = () => {
    setMessage("")
  }

  const recordReset = () => {
    setBlob(null);
    setPreview(false);
    setDisabled(false);
    setRecording(false);
    handleReset();
  }

  const record = async () => {
    const audioData = await blobToBuffer(blob);

    sendMessage(1, audioData)
    recordReset()
  };

  const send = () => {
    if (message.trim() !== "") {
      sendMessage(0, message)
      reset()
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
      e.target.style.height = 'auto';
    }
  }

  const sendMessage = (type, content) => {
    const newMessage = {
      id: uuidv4(),
      content,
      rid: selectedRoom.type === 0 ?
        params?.id !== selectedRoom.recipients.id ?
          params?.id : selectedRoom.recipients.id
        : selectedRoom.id,
      type,
      temp: selectedRoom.temp,
      timestamp: new Date().toString(),
    }

    emitData("message", newMessage, (returnedNewMessage) => {
      if (newMessage.temp) {
        setRooms(prevRooms => prevRooms.map(room => {
          if (room.id === selectedRoom.id) {
            room.id = returnedNewMessage.rid;
            delete room.temp;
            console.log(room)
          }
          return room;
        }))
        setMessages(messages => ({ ...messages, [returnedNewMessage.rid]: [returnedNewMessage] }));
        navigate(`/@me/${returnedNewMessage.rid}`)
      } else {
        setMessages(messages => ({ ...messages, [returnedNewMessage.rid]: [...messages[returnedNewMessage.rid], returnedNewMessage] }));
        setTimeout(scrollDown, 0);
      }
    });
  }

  const scrollDown = () => {
    const messagesContainer = document.querySelector(".messages-container")
    const messagesWrapper = document.querySelector(".messages-wrapper")
    messagesContainer.scrollTo({ top: (messagesWrapper.scrollHeight), behavior: 'smooth' })
  }

  return (
    <div className='footer' style={style(url && preview)}>
      {
        url && preview ? (
          <div className='preview'>
            <CustomAudioBar src={url} />
            {disabled ? (
              <div className='buttons'>
                <button
                  className="send"
                  onClick={() => record()}
                >
                  <SendIcon />
                </button>
                <button
                  className="delete"
                  onClick={() => recordReset()}
                >
                  <TrashIcon />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )
      }
      <div style={{ display: "flex", width: "100%", alignItems: "end" }} >
        {url && disabled ? (
          ""
        ) : (

          <button
            id="recordIcon"
            onClick={() => toggleRecord()}
          >
            <svg viewBox='-13 -13 45 45'>
              <circle
                cx="10"
                cy="10"
                r="14"
                stroke="black"
                strokeWidth="3"
                fill="none"
              />
              <circle
                className={`${recording ? "recording" : ""}`}
                cx="10"
                cy="10"
                r="7"
                stroke="red"
                strokeWidth="3"
                fill="red"
              />
            </svg>
            {isRunning ? <div className='recording-time'>{calculateTime(timer)}</div> : ""}
          </button>
        )}
        <Textarea message={message} onKeyDown={onKeyDown} onInput={(e) => setMessage(e.target.value)} placeholder={'type here...'} disabled={disabled} />
        <button id='send-button' className='send center circle' onClick={send}><SendIcon /></button>
      </div>
    </div>
  )
}

export default Footer
