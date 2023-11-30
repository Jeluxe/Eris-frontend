import React from 'react'
import { Avatar, UserStatus } from './'
import { Link } from 'react-router-dom'
import {
  TrashIcon,
  RestoreIcon,
  AcceptIcon
} from '../assets/icons'

const Friend = ({ data: { id, requestStatus, user } }) => {
  const approve = () => {
    console.log('approved')
  }

  const decline = () => {
    console.log('declined')
  }

  const restore = () => {
    console.log('restored')
  }

  const userInfoElement = (showStatus, { avatar, username, status }) => {
    return <div style={{
      display: "flex",
      columnGap: "10px",
      alignItems: "center",
    }
    }>
      <div style={{ position: "relative", display: "flex" }}>
        <Avatar
          size={36}
          bgColor={avatar}
        />
        {showStatus ? <UserStatus
          status={status}
          absolute={true}
        /> : ""}
      </div>
      <div>{username}</div>
    </div >
  }


  return (
    <>{
      requestStatus !== 'pending' && requestStatus !== 'blocked' ?
        <Link to={`/@me/${user?.id}`} className='friend-wrapper'>
          {userInfoElement(true, user)}
        </Link>
        :
        <div className='friend-wrapper'>
          {userInfoElement(false, user)}
          {requestStatus === 'pending' ?
            <div className='friend-actions'>
              <div className='friend-action' onClick={() => approve(id)}><AcceptIcon /></div>
              <div className='friend-action trash' onClick={() => decline(id)}><TrashIcon /></div>
            </div>
            :
            <div className='friend-actions'>
              <div className='friend-action' onClick={() => restore(id)}><RestoreIcon /></div>
            </div>
          }
        </div>
    }</>
  )
}


export default Friend