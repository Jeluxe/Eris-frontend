import { useParams } from "react-router";
import {
	ArrowDown,
	ArrowUp,
	DeafIcon,
	DeafOffIcon,
	LeaveCallIcon,
	MicIcon,
	MicOffIcon,
	VideoIcon,
	VideoOffIcon
} from "../assets/icons";
import { useMediasoupProvider, useStateProvider } from "../context";
import { Avatar, Video } from "./";

const CallNavbar = ({ avatar }) => {
	const { id } = useParams()
	const {
		inCall, setInCall, muteToggle,
		setMuteToggle, deafToggle, setDeafToggle,
		videoToggle, setVideoToggle, showChat,
		setShowChat, videoContainer,
	} = useStateProvider()

	const {
		localStream,
		remoteStreams,
		closeConnection
	} = useMediasoupProvider();

	return (
		<div className="call-navbar v-center">
			<div className="call-navbar-container">
				<div
					ref={videoContainer}
					id='video-container'
					className="center"
				>
					{
						inCall.activeCall && id === inCall.roomID &&
						<>
							<Video
								type="local"
								stream={localStream}
								videoToggle={videoToggle}
							/>
							{videoToggle ? "" : <Avatar
								size={80}
								bgColor={"green"}
							/>}
							{
								remoteStreams?.map((remoteStream, idx) => {
									const [key, value] = Object.entries(remoteStream)[0];
									return <Video key={idx} type="remote" id={key} stream={value} />
								}
								)
							}
						</>
					}
				</div>
				<div className="call-navbar-actions">
					<div className="circle center" onClick={() => setMuteToggle(!muteToggle)}>
						{muteToggle ? <MicOffIcon /> : <MicIcon />}
					</div>
					<div className="circle center" onClick={() => setDeafToggle(!deafToggle)}>
						{deafToggle ? <DeafOffIcon /> : <DeafIcon />}
					</div>
					<div className="circle center" onClick={() => setVideoToggle(!videoToggle)}>
						{!videoToggle ? <VideoIcon /> : <VideoOffIcon />}
					</div>
					<div className="circle center" onClick={() => {
						closeConnection()
						setInCall({ activeCall: false, roomID: null })
					}}>
						<LeaveCallIcon />
					</div>
				</div>
				<div className="show-hide-chat-button circle" onClick={() => setShowChat(!showChat)}>
					{showChat ? <ArrowDown /> : <ArrowUp />}
				</div>
			</div>
		</div >
	);
};

export default CallNavbar;
