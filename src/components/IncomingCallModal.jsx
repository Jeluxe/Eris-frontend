import { useMediasoupProvider, useStateProvider } from '../context';
import { Avatar } from './';
import { CallIcon, LeaveCallIcon, VideoIcon } from '../assets/icons';

const IncomingCallModal = () => {
  const { incomingCall, setInCall, setVideoToggle, setShowIncomingCallModal } = useStateProvider();
  const { call } = useMediasoupProvider();

  const answerAction = (video) => {
    setVideoToggle(video);
    call(incomingCall.roomID, video);
    setInCall({ activeCall: true, roomID: incomingCall.roomID });
    setShowIncomingCallModal(false)
  }

  const declineAction = () => {
    setShowIncomingCallModal(false)
  }

  return (
    <div className='incoming-call-modal'>
      <Avatar src={incomingCall.user?.avatar} size={85} />
      <div className='modal-text'>
        <span className='modal-info-username'>{incomingCall.user?.username || "username"} </span>
        <span> is calling</span>
      </div>
      <div className='modal-actions'>
        <button className='modal-action' onClick={() => answerAction(false)}><CallIcon /></button>
        <button className='modal-action' onClick={() => answerAction(true)}><VideoIcon /></button>
        <button className='modal-action' onClick={declineAction}><LeaveCallIcon /></button>
      </div>
    </div>
  )
}

export default IncomingCallModal