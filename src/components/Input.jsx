import { useState } from 'react'
import { ShowPasswordIcon, HidePasswordIcon } from '../assets/icons'

const Input = ({ type, onKeyDown = null, placeHolder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`input-wrapper ${type === 'password' ? "password" : ""}`}>
      <input
        placeholder={placeHolder}
        type={
          type === 'password' && !showPassword ?
            "password" : "text"
        }
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