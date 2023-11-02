import { useState } from "react";
import {
	MicIcon,
	MicOffIcon,
	DeafIcon,
	DeafOffIcon,
	VideoIcon,
	VideoOffIcon,
	LeaveCallIcon,
	ArrowDown,
	ArrowUp
} from "../assets/icons";

import { useStateProvider } from "../context";
import { Avatar, Video } from "./";

const CallNavbar = ({ color }) => {
	const {
		setCall,
		audioActions: { mute, setMute, deaf, setDeaf },
		showChat,
		setShowChat } = useStateProvider()
	const [video, setVideo] = useState(false);

	return (
		<div className="call-navbar">
			<div className="call-navbar-container" style={{ position: 'relative' }}>
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
								bgColor={`#${color}`}
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
					{/* <div onClick={() => alert("sharing Screen")}>share</div> */}
					<div onClick={() => setCall(false)}>
						<LeaveCallIcon />
					</div>
					{/* showHideChat */}

				</div>
				<div className="show-hide-chat-button" onClick={() => setShowChat(!showChat)}>
					{showChat ? <ArrowDown /> : <ArrowUp />}
				</div>
			</div>
		</div >
	);
};

export default CallNavbar;
