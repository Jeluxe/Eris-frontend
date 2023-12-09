import { useEffect, useState } from 'react'
import { useField } from '../hooks'
import { useStateProvider } from '../context'
import Input from './Input'
import { debounce } from '../functions'

const NewFriendForm = () => {
  const { emitData } = useStateProvider()
  const [notification, setNotfication] = useState({})
  const { reset, ...newFriend } = useField('text')

  const searchForUsers = async () => {
    if (newFriend.value.trim()) {

      emitData('new-friend-request', newFriend.value, (data) => {
        if (data.type === 'error') {
          setNotfication(data)
        } else {
          setFriendList((prevFriendList) => [...prevFriendList, data])
          setNotfication({ type: 'success', message: `sent friend request to ${data.user.username} successfully` })
        }
      })
    }
    reset()
  }

  const debouncedSearch = debounce(searchForUsers, 500);

  useEffect(() => {
    setNotfication({})
  }, [newFriend.value])

  return (
    <div className='new-friend-form'>
      <div style={{ display: "flex" }}>
        <Input {...newFriend} placeHolder={"Enter username here..."} />
        <button onClick={debouncedSearch}>add</button>
      </div>
      {notification && <span className={`notification ${notification.type === 'success' ? "success" : "error"}`}>{notification.message}</span>}
    </div>
  )
}



export default NewFriendForm