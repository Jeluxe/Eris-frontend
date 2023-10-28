import React, { useContext, useState } from "react";
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
import { Context } from "../context";

const StatusBox = ({ room = "aa", call }) => {
	const navigate = useNavigate();
	const { user, setCall, audioActions: { mute, setMute, deaf, setDeaf } } = useContext(Context)

	return (
		<div className="status-box">
			{call ? (
				<>
					<div className="status-box-info sb-call">
						<div>
							<p>call in progress</p>
							<span>in Room: {room}</span>
						</div>
						<div onClick={() => setCall(false)}>
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
							bgColor={`${user?.color}`}
						/>
						<UserStatus
							status="online"
							absolute={true}
						/>
					</div>
					<div>{user?.name}</div>
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
