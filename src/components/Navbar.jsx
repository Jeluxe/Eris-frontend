import { Link, useMatch } from "react-router-dom";
import { BurgerMenu, CallIcon, FriendsIcon, IoMdPersonAdd, VideoIcon } from "../assets/icons";
import { useMediasoupProvider, useStateProvider } from "../context";
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
	isUserInCall,
	setBurgerMenu,
}) => {
	const match = useMatch("/");
	const { selectedRoom, setInCall, incomingCall, showChat, smallDevice, setSelectedFilter, isOpen, setIsOpen, setVideoToggle } = useStateProvider()
	const { call } = useMediasoupProvider()
	const createBurgerMenuBtn = () => {
		return smallDevice ? (
			<BurgerMenu onClick={() => setBurgerMenu(true)} />
		) : (
			""
		);
	};
	const selectedUser = selectedRoom?.recipients

	const setCall = (video) => {
		setVideoToggle(video)
		call(selectedRoom.id);
		setInCall({ activeCall: true, roomID: selectedRoom.id });
	}

	return (
		<div className={`navbar ${isUserInCall && !match ? "in-call-nav" : ""}${isUserInCall ? showChat ? "" : !match ? " nav-hide-outlet" : "" : ""}`}>
			{selectedRoom ? (
				<div className={`navbar-user ${isUserInCall && !match ? "in-call" : ""}${isUserInCall ? showChat ? "" : !match ? " hide-outlet" : "" : ""}`}>
					<div className="navbar-user-info">
						{smallDevice ? createBurgerMenuBtn() : ""}
						<Avatar
							size={40}
							bgColor={`${selectedUser?.avatar}`}
						/>
						<div>{selectedUser.username}</div>
						<UserStatus status={selectedUser?.status} />
					</div>
					{isUserInCall ? (
						<CallNavbar
							avatar={selectedUser?.avatar}
						/>
					) : (
						<div className="navbar-actions">
							<div
								className="call-button center circle"
								onClick={() => setCall(false)}
							>
								<CallIcon style={style(incomingCall)} />
							</div>
							<div
								className="video-call-button center circle"
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
								</div>
								<Link to="#" className="link add-friend-button" onClick={() => setSelectedFilter('')}>add Friend</Link>
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
