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
		inCall, setInCall, mute,
		setMute, deaf, setDeaf,
		video, setVideo, showChat,
		setShowChat, videoContainer,
	} = useStateProvider()

	const {
		localVideoRef,
		remoteStreams,
		closeConnection
	} = useMediasoupProvider();

	return (
		<div className="call-navbar">
			<div className="call-navbar-container">
				{/* <div className="call-navbar-time">10 : 10 : 10</div> */}

				<div
					ref={videoContainer}
					id='video-container'
				>
					{
						inCall.activeCall && id === inCall.roomID &&
						<>
							<div>
								{video ? (<Video
									type="local"
									ref={localVideoRef}
									muted={true}
								/>) : (
									<Avatar
										size={80}
										bgColor={"green"}
									/>
								)}
							</div>
							{
								remoteStreams?.map((remoteStream, idx) =>
									<Video key={idx} type="remote" remoteStream={Object.values(remoteStream)[0]} />
								)
							}
						</>
					}
				</div>
				<div className="call-navbar-actions">
					<div onClick={() => setMute(!mute)}>
						{mute ? <MicOffIcon /> : <MicIcon />}
					</div>
					<div onClick={() => setDeaf(!deaf)}>
						{deaf ? <DeafOffIcon /> : <DeafIcon />}
					</div>
					<div onClick={() => setVideo(!video)}>
						{video ? <VideoOffIcon /> : <VideoIcon />}
					</div>
					<div onClick={() => {
						closeConnection()
						setInCall({ activeCall: false, roomID: null })
					}}>
						<LeaveCallIcon />
					</div>
				</div>
				<div className="show-hide-chat-button" onClick={() => setShowChat(!showChat)}>
					{showChat ? <ArrowDown /> : <ArrowUp />}
				</div>
			</div>
		</div >
	);
};

export default CallNavbar;
