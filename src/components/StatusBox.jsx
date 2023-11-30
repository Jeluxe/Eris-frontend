import Avatar from "./Avatar";
import UserStatus from "./UserStatus";
import HDivider from "./H_Divider";
import {
	DeafIcon,
	DeafOffIcon,
	LeaveCallIcon,
	MicIcon,
	MicOffIcon,
	SettingsIcon
} from "../assets/icons";
import { useNavigate } from "react-router";
import { useStateProvider } from "../context";

const StatusBox = ({ call }) => {
	const navigate = useNavigate();
	const { user, status, setCall, audioActions: { mute, setMute, deaf, setDeaf } } = useStateProvider()

	return (
		<div className="status-box">
			{call.inCall ? (
				<>
					<div className="status-box-info sb-call">
						<div>
							<p>call in progress</p>
							<span>Room: <div onClick={() => navigate(`/@me/${call.roomId}`)}>{call.roomId}</div></span>
						</div>
						<div className="sb-user-action" onClick={() => setCall({ inCall: false, roomId: null })}>
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
