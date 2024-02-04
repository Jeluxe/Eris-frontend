import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { SendIcon, TrashIcon } from '../assets/icons'
import { useSocketIOProvider, useStateProvider } from '../context'
import { blobToBuffer } from '../functions'
import { useRecorder } from '../hooks'
import { CustomAudioBar, Textarea } from './'

const style = (condition) => {
  return {
    alignItems: condition ? "normal" : "end",
    flexDirection: condition ? "column" : "row"
  }
}

const Footer = () => {
  const params = useParams()
  const { user, setMessages, selectedRoom } = useStateProvider();
  const { emitData } = useSocketIOProvider();
  const { startRecording, stopRecording, url, blob, setBlob } = useRecorder();
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
    setRecording(false)
  }

  const record = async () => {
    const audioData = await blobToBuffer(blob);

    sendMessage(2, audioData)
    recordReset()
  };

  const send = () => {
    if (message.trim() !== "") {
      sendMessage(1, message)
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

  const resize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = (e.target.scrollHeight) + 'px';
  }

  const onInput = (e) => {
    resize(e)
    setMessage(e.target.value)
  }

  const sendMessage = (type, content) => {
    const newMessage = {
      content,
      rid: selectedRoom.type === 0 ?
        params?.id !== selectedRoom.recipients.id ?
          params?.id : selectedRoom.recipients.id
        : selectedRoom.id,
      type,
      timestamp: new Date().toString(),
    }

    emitData("message", newMessage, (returnedNewMessage) => {
      setMessages(messages => messages.concat(returnedNewMessage))
    });
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
      {url && disabled ? (
        ""
      ) : (
        <button
          className="recordIcon"
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
        </button>
      )}
      <div style={{ display: "flex", width: "100%", alignItems: "end" }}>
        <Textarea message={message} onKeyDown={onKeyDown} onInput={onInput} placeholder={'type here...'} disabled={disabled} />
        <button id='send-button' className='send center circle' onClick={send}><SendIcon /></button>
      </div>
    </div>
  )
}

export default Footer
