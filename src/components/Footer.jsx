import { useEffect, useState } from 'react'
import { useMatches } from 'react-router'
import { useStateProvider } from '../context'
import { useField, useRecorder } from '../hooks'
import { SendIcon, TrashIcon } from '../assets/icons'
import { blobToBuffer } from '../functions'
import CustomAudioBar from './CustomAudioBar'
import Input from './Input'

const Footer = () => {
  const matches = useMatches()
  const { user, setMessages, emitData } = useStateProvider()
  const { reset, ...message } = useField('text')
  const { startRecording, stopRecording, url, blob, setBlob } = useRecorder();
  const [preview, setPreview] = useState(false);
  const [recording, setRecording] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    return () => {
      reset()
      recordReset()
    }
  }, [matches])


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

  const recordReset = () => {
    setBlob(null);
    setPreview(false);
    setDisabled(false);
    setRecording(false)
  }

  const onClick = async () => {
    const audioData = await blobToBuffer(blob);

    sendMessage(2, audioData)

    recordReset()
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (message.value.trim() !== "") {
        sendMessage(1, message.value)
        reset()
      }
    }
  }

  const sendMessage = (type, content) => {
    const newMessage = {
      content,
      user,
      rid: matches[1]?.params.id,
      type,
      timestamp: new Date().toString(),
      edited_timestamp: null
    }

    emitData("message", newMessage, (returnedNewMessage) => {
      setMessages(messages => messages.concat(returnedNewMessage))
    });
  }

  return (
    <div className='footer'>
      {
        url && preview ? (
          <div className='preview'>
            <CustomAudioBar src={url} />
            {disabled ? (
              <div className='buttons'>
                <button
                  className="send"
                  onClick={() => onClick()}
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
      <div style={{ display: "flex" }}>
        {url && disabled ? (
          ""
        ) : (
          <button
            className="circleBtn recordIcon"
            onClick={() => toggleRecord()}
          >
            <svg height="34" width="34">
              <circle
                cx="17"
                cy="17"
                r="14"
                stroke="black"
                strokeWidth="3"
                fill="none"
              />
              <circle
                className={`${recording ? "recording" : ""}`}
                cx="17"
                cy="17"
                r="7"
                stroke="red"
                strokeWidth="3"
                fill="red"
              />
            </svg>
          </button>
        )}
        <Input onKeyDown={onKeyDown} disabled={disabled} {...message} placeHolder={'type here...'} />
      </div>
    </div>
  )
}

export default Footer
