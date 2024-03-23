import { useNavigate } from "react-router";
import {
	DeafIcon,
	DeafOffIcon,
	LeaveCallIcon,
	MicIcon,
	MicOffIcon,
	SettingsIcon,
	VideoIcon,
	VideoOffIcon
} from "../assets/icons";
import { useMediasoupProvider, useStateProvider } from "../context";
import { Avatar, HDivider, UserStatus } from "./";

const StatusBox = () => {
	const navigate = useNavigate();
	const {
		user, status, inCall, setInCall, muteToggle, setMuteToggle, deafToggle, setDeafToggle, videoToggle, setVideoToggle, getRoomName
	} = useStateProvider();
	const { closeConnection } = useMediasoupProvider();

	const handleLeaveCall = () => {
		closeConnection();
		setInCall({ activeCall: false, roomID: null });
	}

	return (
		<div className="status-box">
			{inCall.activeCall && (
				<>
					<div className="sb-wrapper sb-call">
						<div style={{ marginBottom: "5px" }}>
							<div className="col">
								<p>call in progress</p>
								<span onClick={() => navigate(`/@me/${inCall.roomID}`)}>{getRoomName(inCall.roomID)}</span>
							</div>
							<div className="sb-user-action"
								onClick={handleLeaveCall}>
								<LeaveCallIcon />
							</div>
						</div>
						<div>
							<button id="video-button" className="button center" onClick={() => setVideoToggle(!videoToggle)}>
								{!videoToggle ? <VideoIcon /> : <VideoOffIcon />}
							</button>
						</div>
					</div>
					<HDivider />
				</>
			)}
			<div className="sb-wrapper">
				<div className="sb-user">
					<div>
						<Avatar
							size={35}
							bgColor={user?.avatar}
						/>
						<UserStatus
							status={status}
							absolute={true}
						/>
					</div>
					<div>{user?.username}</div>
				</div>
				<div className="sb-user-actions">
					<div
						className="sb-user-action"
						onClick={() => setMuteToggle(!muteToggle)}
					>
						{!muteToggle ? <MicIcon /> : <MicOffIcon />}
					</div>
					<div
						className="sb-user-action"
						onClick={() => setDeafToggle(!deafToggle)}
					>
						{!deafToggle ? <DeafIcon /> : <DeafOffIcon />}
					</div>
					<div
						className="sb-user-action"
						onClick={() => { }}
					>
						<SettingsIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatusBox;