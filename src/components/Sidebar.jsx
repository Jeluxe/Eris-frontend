import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, FriendsIcon } from "../assets/icons";
import { useStateProvider } from "../context";
import { Avatar, HDivider, UserStatus } from "./";

const Sidebar = ({ smallDevice, setBurgerMenu }) => {
	const { rooms, setRooms, selectedRoom, messages } = useStateProvider();

	const openSidebar = () => {
		smallDevice ? setBurgerMenu(false) : "";
	};

	useEffect(() => {
		const lastMessage = messages?.at(-1);
		const foundRoom = rooms?.find(room => room?.user?.id === lastMessage?.roomID);
		if (foundRoom) {
			const filteredList = rooms?.filter(room => room?.id !== foundRoom?.id);
			const reorderedList = [foundRoom, ...filteredList].map((room, idx) => {
				return {
					...room,
					index: idx,
				}
			});
			setRooms(reorderedList);
		}
	}, [messages]);

	return (
		<div className="sidebar">
			<div className="sidebar-top">
				<Link
					to="/"
					className="link friends-link"
					onClick={() => openSidebar()}
				>
					<FriendsIcon />
					Friends
				</Link>
				{smallDevice ? (
					<div onClick={() => setBurgerMenu(false)}>
						<CloseIcon />
					</div>
				) : (
					""
				)}
			</div>
			<HDivider />
			<div className="sidebar-list">
				{rooms?.map((room, idx) => {
					if (!room?.recipients) {
						return;
					}

					const { username, avatar, status } = room.recipients;
					return (
						<Link
							key={idx}
							className={`link user-links ${selectedRoom?.id === room.id ? "active" : ""}`}
							to={`/@me/${room.id}`}
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
