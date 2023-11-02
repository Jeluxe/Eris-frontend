import { useEffect, useState } from "react";
import { useMatches } from "react-router";
import { Link } from "react-router-dom";
import { CallIcon, FriendsIcon, VideoIcon, BurgerMenu } from "../assets/icons";
import { useStateProvider } from "../context";
import { Avatar, CallNavbar, Checkbox, UserStatus, VDivider } from "./";

const style = (incomingCall) => {
	return {
		height: "25px",
		width: "25px",
		color: incomingCall ? "green" : "black"
	};
};

const categories = ["All", "Online", "Blocked", "Pending"];

const Navbar = ({
	smallDevice,
	match,
	call,
	setBurgerMenu,
}) => {
	const matches = useMatches();
	const [selectedUser, setSelectedUser] = useState(null)
	const [incomingCall, setIncomingCall] = useState(false);
	const { setCall, showChat } = useStateProvider()

	useEffect(() => {
		matches && matches[1] && matches[1].pathname.includes("/@me/")
			? setSelectedUser(matches[1].params)
			: setSelectedUser(null);
	}, [matches]);

	const createBurgerMenuBtn = () => {
		return smallDevice ? (
			<BurgerMenu onClick={() => setBurgerMenu(true)} />
		) : (
			""
		);
	};

	return (
		<div className={`navbar ${call && !match ? "in-call-nav" : ""} ${call ? showChat ? "" : !match ? "nav-hide-outlet" : "" : ""}`}>
			{selectedUser ? (
				<div className={`navbar-user ${call ? "in-call" : ""} ${call ? showChat ? "" : !match ? "hide-outlet" : "" : ""}`}>
					<div className="navbar-user-info">
						{smallDevice ? createBurgerMenuBtn() : ""}
						<Avatar
							size={40}
							bgColor={`#${selectedUser.color}`}
						/>
						<div>{selectedUser.id}</div>
						<UserStatus status={"online"} />
					</div>
					{call ? (
						<CallNavbar
							color={selectedUser.color}
						/>
					) : (
						<div className="navbar-actions">
							<div
								className="call-btn"
								onClick={() => setCall(true)}
							>
								<CallIcon style={style(incomingCall)} />
							</div>
							<div
								className="video-call-btn"
								onClick={() => setCall(true)}
							>
								<VideoIcon style={style(incomingCall)} />
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="navbar-friends">
					{createBurgerMenuBtn()}
					<FriendsIcon />
					friends
					{
						!smallDevice ?
							<>
								<VDivider />
								<div className="navbar-categories">
									{categories.map((category, idx) => (
										<Checkbox
											key={idx}
											target={category}
										/>
									))}

									<Link to="#" className="link add-friend-button">add Friend</Link>
								</div>
							</> : ""
					}
				</div>
			)}
		</div>
	);
};

export default Navbar;
