import { useLayoutEffect, useState } from "react";
import { useMatches } from "react-router";
import { Link } from "react-router-dom";
import { BurgerMenu, CallIcon, FriendsIcon, IoMdPersonAdd, VideoIcon } from "../assets/icons";
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
	match,
	setBurgerMenu,
}) => {
	const matches = useMatches();
	const [small, setSmall] = useState(false);
	const { selectedRoom, inCall, setInCall, incomingCall, showChat, smallDevice, setSelectedFilter, isOpen, setIsOpen } = useStateProvider()

	const createBurgerMenuBtn = () => {
		return smallDevice ? (
			<BurgerMenu onClick={() => setBurgerMenu(true)} />
		) : (
			""
		);
	};
	const selectedUser = selectedRoom?.user
	const condition = inCall.activeCall && matches[1]?.params.id === inCall.roomId

	useLayoutEffect(() => {
		window.innerWidth < 1063 ? setSmall(true) : setSmall(false)

		window.addEventListener('resize', (e) => {
			const width = e.currentTarget.innerWidth;
			width < 1063 ? setSmall(true) : setSmall(false)
		})

		return () => {
			window.removeEventListener('resize', () => { })
		}
	}, [])

	return (
		<div className={`navbar ${condition && !match ? "in-call-nav" : ""} ${condition ? showChat ? "" : !match ? "nav-hide-outlet" : "" : ""}`}>
			{selectedRoom ? (
				<div className={`navbar-user ${condition && !match ? "in-call" : ""} ${condition ? showChat ? "" : !match ? "hide-outlet" : "" : ""}`}>
					<div className="navbar-user-info">
						{smallDevice ? createBurgerMenuBtn() : ""}
						<Avatar
							size={40}
							bgColor={`${selectedUser?.avatar}`}
						/>
						<div>{selectedUser.username}</div>
						<UserStatus status={selectedUser?.status} />
					</div>
					{inCall.activeCall && inCall.roomId === matches[1]?.params.id ? (
						<CallNavbar
							avatar={selectedUser?.avatar}
						/>
					) : (
						<div className="navbar-actions">
							<div
								className="call-btn"
								onClick={() => setInCall({ activeCall: true, roomId: selectedUser.id })}
							>
								<CallIcon style={style(incomingCall)} />
							</div>
							<div
								className="video-call-btn"
								onClick={() => setInCall({ activeCall: true, roomId: selectedUser.id })}
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
					<span
						style={{ cursor: smallDevice ? "pointer" : "default" }}
						onClick={() => (smallDevice ? setSelectedFilter('All') : "")}>
						friends
					</span>
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
									{small ?
										<div className="navbar-category-label" style={{ padding: 0, width: 30 }} onClick={() => setSelectedFilter('')}><IoMdPersonAdd /></div>
										: <Link to="#" className="link add-friend-button" onClick={() => setSelectedFilter('')}>add Friend</Link>}
								</div>
							</> :
							<div className="navbar-category-label"
								onClick={() => {
									isOpen ? setSelectedFilter('All') : setSelectedFilter('')
									setIsOpen(!isOpen)
								}}
								style={{
									position: "absolute",
									right: 30
								}}><IoMdPersonAdd /></div>
					}
				</div>
			)}
		</div>
	);
};

export default Navbar;
