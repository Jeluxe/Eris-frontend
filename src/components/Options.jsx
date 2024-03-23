import { useEffect, useRef, useState } from 'react';
import { EditIcon, OptionsIcon, TrashIcon } from '../assets/icons';

const Options = ({ type, selectedMessage, setSelectedMessage, editMessage, deleteMessage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);

  const onClick = (fn) => {
    setDropdownOpen(false);
    fn();
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && (dropdownOpen || selectedMessage)) {
        setDropdownOpen(false);
        setSelectedMessage(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [dropdownOpen, selectedMessage, setSelectedMessage]);

  return (
    <div className='options' ref={ref}>
      {dropdownOpen ? (
        <div className='dropdown'>
          {type !== 1 && (
            <button className='option' onClick={() => onClick(editMessage)} >
              <EditIcon />
              edit
            </button>
          )}
          <button className='option delete' onClick={() => onClick(deleteMessage)}>
            <TrashIcon />
            delete
          </button>
        </div>
      ) : (
        <OptionsIcon className='options-button' color='gray' onClick={() => setDropdownOpen(true)} />
      )}
    </div>
  );
};

export default Options;

