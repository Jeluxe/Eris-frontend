const Textarea = ({ message, onInput, onKeyDown, placeholder, disabled }) => {
  return (
    <textarea value={message} rows="1" maxLength={2000} onInput={onInput} onKeyDown={onKeyDown} placeholder={placeholder} disabled={disabled}></textarea>
  )
}

export default Textarea