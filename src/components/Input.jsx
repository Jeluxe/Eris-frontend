import { useState } from 'react'
import { ShowPasswordIcon, HidePasswordIcon } from '../assets/icons'

const Input = ({ type, value = null, onChange = null, onKeyDown = null, disabled = false, placeHolder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`input-wrapper ${type === 'password' ? "password" : ""}`}>
      <input
        type={
          type === 'password' && !showPassword ?
            "password" : "text"
        }
        value={value}
        placeholder={placeHolder}
        disabled={disabled}
        onChange={onChange}
        onKeyDown={onKeyDown}
        {...props}
      />
      {type === 'password' &&
        <button
          type='button'
          title='showPassword'
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
        </button>}
    </div>
  )
}

export default Input