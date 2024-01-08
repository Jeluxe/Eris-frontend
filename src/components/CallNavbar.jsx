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

import { useStateProvider } from "../context";
import { Avatar, Video } from "./";

const CallNavbar = ({ avatar }) => {
	const {
		setCall, mute, setMute, deaf, setDeaf, video, setVideo, showChat, setShowChat
	} = useStateProvider()

	return (
		<div className="call-navbar">
			<div className="call-navbar-container">
				{/* <div className="call-navbar-time">10 : 10 : 10</div> */}

				<div className="call-navbar-participants">
					<div>
						{video ? (
							<Video />
						) : (
							<Avatar
								size={80}
								bgColor={"green"}
							/>
						)}
					</div>
					<div>
						{video ? (
							<Video />
						) : (
							<Avatar
								size={80}
								bgColor={`${avatar}`}
							/>
						)}
					</div>
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
					<div onClick={() => setCall(false)}>
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
