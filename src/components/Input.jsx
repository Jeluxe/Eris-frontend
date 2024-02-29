import { useState } from 'react';
import { HidePasswordIcon, ShowPasswordIcon } from '../assets/icons';

const Input = ({ type, value = null, onChange = null, onKeyDown = null, disabled = false, placeHolder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && !showPassword ? 'password' : 'text';

  return (
    <div className={`input-wrapper ${type === 'password' ? "password" : ""}`}>
      <input
        type={inputType}
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
          title={showPassword ? 'Hide Password' : 'Show Password'}
          aria-label={showPassword ? 'Hide Password' : 'Show Password'}
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? <ShowPasswordIcon /> : <HidePasswordIcon />}
        </button>}
    </div>
  );
};

export default Input;