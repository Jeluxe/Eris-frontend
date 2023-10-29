import { useState } from 'react'
import { ShowPasswordIcon, HidePasswordIcon } from '../assets/icons'

const Input = ({ type, ...props }) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className={`input-wrapper ${type === 'password' ? "password" : ""}`}>
      <input
        placeholder='type here...'
        type={
          type === 'password' && !toggle ?
            "password" : "text"
        }
        {...props}
      />
      {type === 'password' && <button
        onClick={() => setToggle(!toggle)}
      >
        {!toggle ? <ShowPasswordIcon /> : <HidePasswordIcon />}
      </button>}
    </div>
  )
}

export default Input