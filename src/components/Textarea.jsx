import { useEffect, useRef } from "react";

const Textarea = ({ message, onInput, onKeyDown, placeholder, disabled }) => {
  const textareaRef = useRef(null)
  const resize = (target) => {
    target.style.height = 'auto';
    target.style.height = (target.scrollHeight) + 'px';
  }

  const inputEvent = (e) => {
    resize(e.target)
    onInput(e)
  }

  useEffect(() => {
    resize(textareaRef.current)
  }, [])

  return (
    <textarea ref={textareaRef} value={message} rows="1" maxLength={2000} onInput={inputEvent} onKeyDown={onKeyDown} placeholder={placeholder} disabled={disabled}></textarea>
  )
}

export default Textarea