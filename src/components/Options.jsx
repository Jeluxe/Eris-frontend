import { useEffect, useRef, useState } from 'react'
import { EditIcon, OptionsIcon, TrashIcon } from '../assets/icons'

const Options = ({ type, selectedMessage, setSelectedMessage, editMessage, deleteMessage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef(null)

  const onClick = (fn) => {
    setDropdownOpen(false)
    fn()
  }

  useEffect(() => {
    const eventHandler = (e) => {
      if (e.key === 'Escape' && (dropdownOpen || selectedMessage)) {
        setDropdownOpen(false)
        setSelectedMessage(null)
      }
    }

    document.addEventListener('keydown', eventHandler)

    return () => {
      document.removeEventListener('keydown', eventHandler)
    }
  }, [dropdownOpen, selectedMessage])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);




  return (
    <div className='options' ref={ref}>
      {
        dropdownOpen ?
          <div className='dropdown'>
            {type !== 2 ? <button className='option' onClick={() => onClick(editMessage)} disabled={selectedMessage}>
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

