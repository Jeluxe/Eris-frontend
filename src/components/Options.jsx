import React, { useState } from 'react'
import { OptionsIcon, TrashIcon, EditIcon } from '../assets/icons'

const Options = ({ type, edit, deleteMessage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const onClick = (fn) => {
    setDropdownOpen(false)
    fn()
  }

  return (
    <div
      className='options'

    >
      {
        dropdownOpen ?
          <div className='dropdown' tabIndex="0" onBlur={() => setDropdownOpen(false)}>
            {type !== 2 ? <button className='option' onClick={() => onClick(edit)}>
              <EditIcon />
              edit
            </button> : ""}
            <button className='option delete' onClick={() => onClick(deleteMessage)}>
              <TrashIcon />
              delete
            </button>
          </div> :
          <OptionsIcon className='options-button' color='gray' onClick={() => setDropdownOpen(true)} />
      }
    </div>
  )
}

export default Options

