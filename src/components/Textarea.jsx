import { useEffect, useRef } from "react";

const Textarea = ({ message, onInput, onKeyDown, placeholder, disabled }) => {
  const textareaRef = useRef(null);

  const resizeTextarea = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
  }

  const handleInput = (e) => {
    resizeTextarea(e.target);
    onInput(e);
  }

  useEffect(() => {
    resizeTextarea(textareaRef.current);
  }, [onInput, message]);

  return (
    <textarea
      ref={textareaRef}
      value={message}
      maxLength={2000}
      onInput={handleInput}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
    ></textarea>
  );
};

export default Textarea;