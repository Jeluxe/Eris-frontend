import React, { useContext } from 'react'
import Input from './Input'
import { useField } from '../hooks'
import { useMatches } from 'react-router'
import { Context } from '../context'

const Footer = ({ setMessages }) => {
  const matches = useMatches()
  const { user } = useContext(Context)
  const { reset, ...message } = useField('text')

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (message.value.trim() !== "") {
        const newObject = {
          message: message.value,
          sender: {
            id: user.id,
            username: user.name,
            color: user.color,
          },
          type: 1,
          timestamp: new Date(),
          edited_timestamp: null
        }

        console.log({ newObject, to: matches[1].params.id })
        setMessages(messages => [...messages, newObject])
        reset()
      }
    }
  }

  return (
    <div className='chat-input-container'>
      <Input onKeyDown={onKeyDown} {...message} placeHolder={'type here...'} />
    </div>
  )
}

export default Footer