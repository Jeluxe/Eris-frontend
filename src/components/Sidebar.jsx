import { Link } from "react-router-dom";
import { CloseIcon, FriendsIcon } from "../assets/icons";
import { useStateProvider } from "../context";
import { Avatar, HDivider, UserStatus } from "./";

const Sidebar = ({ smallDevice, setBurgerMenu }) => {
	const { rooms, selectedRoom, setSelectedRoom } = useStateProvider();

	const openSidebar = () => {
		smallDevice && setBurgerMenu(false);
	};

	return (
		<div className="sidebar">
			<div className="sidebar-top">
				<Link
					to="/"
					className="link friends-link"
					onClick={() => {
						setSelectedRoom(null);
						openSidebar();
					}}
				>
					<FriendsIcon />
					Friends
				</Link>
				{smallDevice && <CloseIcon onClick={() => setBurgerMenu(false)} />}
			</div>
			<HDivider />
			<div className="sidebar-list">
				{rooms?.map((room, idx) => {
					if (!room?.recipients) {
						return;
					}

					const { id, recipients: { username, avatar, status } } = room;
					return (
						<Link
							key={idx}
							className={`link user-links ${selectedRoom?.id === id ? "active" : ""}`}
							to={`/@me/${id}`}
							onClick={() => openSidebar()}
						>
							<div style={{ position: "relative", display: "flex" }}>
								<Avatar
									size={35}
									bgColor={avatar}
								/>
								<UserStatus
									status={status}
									absolute={true}
								/>
							</div>
							<p>{username}</p>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Sidebar;
