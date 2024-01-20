import { useEffect, useState } from 'react'
import { useSocketIOProvider, useStateProvider } from '../context'
import { debounce } from '../functions'
import { useField } from '../hooks'
import Input from './Input'

const NewFriendForm = () => {
  const { setFriendList } = useStateProvider();
  const { emitData } = useSocketIOProvider()
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