import React, { useState } from 'react'
import { useField } from '../hooks'
import Input from './Input'

const NewFriendForm = () => {
  const [notification, setNotfication] = useState("")
  const { reset, ...newFriend } = useField('text')

  const searchForUsers = async () => {
    if (newFriend.value.trim()) {

      // sendRequestToServer()
      // .then(res  => setNofification(res))
      // .catch(err => setNofification(err))
      setNotfication(Math.random() < 0.5 ? "success" : "failed")
    }
  }

  const debounce = (fn, ms) => {
    let timeout;

    return () => {
      if (timeout)
        clearTimeout(timeout)

      timeout = setTimeout(() => {
        fn()
      }, ms);
    }
  }

  const debouncedSearch = debounce(searchForUsers, 500);

  return (
    <div className='new-friend-form'>
      <div style={{ display: "flex" }}>
        <Input {...newFriend} placeHolder={"Enter username here..."} />
        <button onClick={debouncedSearch}>add</button>
      </div>
      {notification && <span className={`notification ${notification === 'success' ? "success" : "error"}`}>{notification}</span>}
    </div>
  )
}



export default NewFriendForm