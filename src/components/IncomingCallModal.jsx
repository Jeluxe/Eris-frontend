import { CallIcon, LeaveCallIcon, VideoIcon } from '../assets/icons';
import { useMediasoupProvider, useStateProvider } from '../context';
import { Avatar } from './';

const IncomingCallModal = () => {
  const { incomingCall, inCall, setInCall, setVideoToggle, setShowIncomingCallModal } = useStateProvider();
  const { call } = useMediasoupProvider();

  const answerCall = (video) => {
    if (incomingCall && inCall.roomID !== incomingCall.roomID) {
      setVideoToggle(video);
      call(incomingCall.roomID, video);
      setInCall({ activeCall: true, roomID: incomingCall.roomID });
    }
    setShowIncomingCallModal(false);
  }

  const declineCall = () => {
    setShowIncomingCallModal(false);
  }

  return (
    <>
      {
        inCall.roomID !== incomingCall.roomID ?
          <div className='incoming-call-modal'>
            <Avatar avatar={incomingCall.user?.avatar} size={85} />
            <div className='modal-text'>
              <span className='modal-info-username'>{incomingCall.user?.username || "Unknown User"} </span>
              <span> is calling</span>
            </div>
            <div className='modal-actions'>
              <button className='modal-action' onClick={() => answerCall(false)}><CallIcon /></button>
              <button className='modal-action' onClick={() => answerCall(true)}><VideoIcon /></button>
              <button className='modal-action' onClick={declineCall}><LeaveCallIcon /></button>
            </div>
          </div> :
          ""
      }
    </>
  );
};

export default IncomingCallModal;