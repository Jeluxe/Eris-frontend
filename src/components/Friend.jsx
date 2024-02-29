import { Link, useNavigate } from 'react-router-dom';
import {
  AcceptIcon,
  RestoreIcon,
  TrashIcon
} from '../assets/icons';
import { useSocketIOProvider, useStateProvider } from '../context';
import { getRandomColor, handleUpdateFriendRequest } from '../functions';
import { Avatar, UserStatus } from './';


const Friend = ({ data: { id, status, user, isSender } }) => {
  const navigate = useNavigate();
  const { rooms, setRooms, friendList, setFriendList, setSelectedRoom } = useStateProvider();
  const { emitData } = useSocketIOProvider();

  const makeDecision = (decision) => {
    emitData('update-friend-request', id, decision, (result) => {
      setFriendList(prevRequests => handleUpdateFriendRequest(prevRequests, result));
    });
  }

  const userInfoElement = (showStatus, { avatar, username, status }) => {
    return <div style={{ display: "flex", columnGap: "10px", alignItems: "center", }}>
      <div style={{ position: "relative", display: "flex" }}>
        <Avatar size={36} bgColor={avatar} />
        {showStatus && <UserStatus status={status} absolute={true} />}
      </div>
      <div>{username}</div>
    </div >
  }

  const getRoomID = (userID) => {
    const foundRoom = rooms?.find(room => room.recipients?.id === userID);
    return foundRoom ? foundRoom.id : userID;
  }

  const selectRoom = (e, id) => {
    e.preventDefault();
    if (rooms?.length) {
      if (id) {
        const foundRoom = rooms.find(room => room.id === id || room.recipients.id === id);
        const foundFriend = friendList.find(friend => friend.user.id === id);
        if (foundFriend && !foundRoom) {
          const newTempRoom = {
            id: foundFriend.id,
            type: 0,
            temp: true,
            index: rooms?.length,
            recipients: {
              ...foundFriend.user,
              avatar: getRandomColor(),
              status: 'offline'
            }
          }
          setRooms((prevRooms) => [...prevRooms, newTempRoom]);
          navigate(`/@me/${newTempRoom.id}`);
        } else if (foundRoom) {
          setSelectedRoom(foundRoom);
          navigate(`/@me/${foundRoom.id}`);
        } else {
          setSelectedRoom(null);
        }
      } else {
        setSelectedRoom(null);
      }
    }
  }


  return (
    <>
      {status && status !== 'PENDING' && status !== 'BLOCKED' ? (
        <Link to={`/@me/${getRoomID(user.id)}`} className='friend-wrapper' onClick={(e) => selectRoom(e, getRoomID(user.id))}>
          {userInfoElement(true, user)}
        </Link>
      ) : (
        <div className='friend-wrapper'>
          {userInfoElement(false, user)}
          {status === 'PENDING' ?
            <div className='friend-actions'>
              {!isSender && <div className='friend-action' onClick={() => makeDecision('accept')}><AcceptIcon /></div>}
              <div className='friend-action trash' onClick={() => makeDecision('decline')}><TrashIcon /></div>
            </div>
            :
            <div className='friend-actions'>
              <div className='friend-action' onClick={() => makeDecision('restore')}><RestoreIcon /></div>
            </div>
          }
        </div>
      )}
    </>
  );
};


export default Friend;