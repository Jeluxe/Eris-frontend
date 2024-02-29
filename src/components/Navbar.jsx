import { Link, useMatch, useParams } from "react-router-dom";
import { BurgerMenu, CallIcon, FriendsIcon, IoMdPersonAdd, VideoIcon } from "../assets/icons";
import { useMediasoupProvider, useSocketIOProvider, useStateProvider } from "../context";
import { Avatar, CallNavbar, Checkbox, UserStatus, VDivider } from "./";

const style = (incomingCall) => {
	return {
		height: "25px",
		width: "25px",
		color: incomingCall ? "green" : "black"
	};
};

const categories = ["All", "Online", "Blocked", "Pending"];

const Navbar = ({ isUserInCall, setBurgerMenu }) => {
	const match = useMatch("/");
	const params = useParams();
	const { selectedRoom, setInCall, incomingCall, showChat, smallDevice, setSelectedFilter, isOpen, setIsOpen, setVideoToggle } = useStateProvider();
	const { emitData } = useSocketIOProvider();
	const { call } = useMediasoupProvider();

	const handleCall = (video) => {
		setVideoToggle(video);
		call(selectedRoom.id, video);
		setInCall({ activeCall: true, roomID: selectedRoom.id });
		emitData("make-call", selectedRoom.recipients.id);
	}

	const renderBurgerMenuButton = () => (smallDevice ? <BurgerMenu onClick={() => setBurgerMenu(true)} /> : null);

	const renderNavbarContent = () => {
		if (selectedRoom) {
			const selectedUser = selectedRoom?.recipients;
			return (
				<div className={`navbar-user ${isUserInCall && !match ? "in-call" : ""}${isUserInCall ? showChat ? "" : !match ? " hide-outlet" : "" : ""}`}>
					<div className="navbar-user-info">
						{renderBurgerMenuButton()}
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
							<div className="call-button center circle" onClick={() => handleCall(false)}>
								<CallIcon style={style(incomingCall.active && incomingCall.roomID === params?.id)} />
							</div>
							<div className="video-call-button center circle" onClick={() => handleCall(true)}>
								<VideoIcon style={style(incomingCall.active && incomingCall.roomID === params?.id)} />
							</div>
						</div>
					)}
				</div>
			)
		} else {
			return (
				<div className="navbar-friends">
					{renderBurgerMenuButton()}
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
			);
		}
	}

	return <div className={`navbar ${isUserInCall && !match ? "in-call-nav" : ""}${isUserInCall ? showChat ? "" : !match ? " nav-hide-outlet" : "" : ""}`}>{renderNavbarContent()}</div>;
};

export default Navbar;
