import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
	DeafIcon,
	DeafOffIcon,
	LeaveCallIcon,
	MicIcon,
	MicOffIcon,
	SettingsIcon
} from "../assets/icons";
import { useMediasoupProvider, useStateProvider } from "../context";
import { Avatar, HDivider, UserStatus } from "./";

const StatusBox = () => {
	const navigate = useNavigate();
	const {
		user, status, inCall, setInCall, mute, setMute, deaf, setDeaf
	} = useStateProvider()
	const { closeConnection } = useMediasoupProvider();

	useEffect(() => { console.log(inCall) }, [inCall])

	return (
		<div className="status-box">
			{inCall.activeCall ? (
				<>
					<div className="status-box-info sb-call">
						<div>
							<p>call in progress</p>
							<span>Room: <div onClick={() => navigate(`/@me/${inCall.roomID}`)}>{inCall.roomID}</div></span>
						</div>
						<div className="sb-user-action" onClick={() => {
							closeConnection();
							setInCall({ activeCall: false, roomID: null });
						}}>
							<LeaveCallIcon />
						</div>
					</div>
					<HDivider />
				</>
			) : null}
			<div className="status-box-info sb-user">
				<div className="status-box-info sb-user-info">
					<div style={{ position: "relative", display: "flex" }}>
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
				<div className="status-box-info sb-user-actions">
					<div
						className="sb-user-action"
						onClick={() => setMute(!mute)}
					>
						{!mute ? <MicIcon /> : <MicOffIcon />}
					</div>
					<div
						className="sb-user-action"
						onClick={() => setDeaf(!deaf)}
					>
						{!deaf ? <DeafIcon /> : <DeafOffIcon />}
					</div>
					<div
						className="sb-user-action"
						onClick={() => navigate("/settings")}
					>
						<SettingsIcon />
					</div>
				</div>
			</div>
		</div>
	);
};

export default StatusBox;
