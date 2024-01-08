import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CloseIcon, FriendsIcon } from "../assets/icons";
import { useStateProvider } from "../context";
import { Avatar, HDivider, UserStatus } from "./";

const Sidebar = ({ smallDevice, height, setBurgerMenu }) => {
	const { inCall, rooms, setRooms, selectedRoom, messages } = useStateProvider()

	const openSidebar = () => {
		smallDevice ? setBurgerMenu(false) : "";
	};

	useEffect(() => {
		const lastMessage = messages?.at(-1)
		const foundRoom = rooms?.find(room => room?.user?.id === lastMessage?.roomID)
		if (foundRoom) {
			const filteredList = rooms?.filter(room => room?.id !== foundRoom?.id)
			const reorderedList = [foundRoom, ...filteredList].map((room, idx) => {
				return {
					id: room.id,
					index: idx,
					type: room.type,
					participants: room.participants
				}
			})
			setRooms(reorderedList)
		}
	}, [messages])

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
			<div
				className="sidebar-list"
				style={{
					minHeight: inCall.activeCall ? "412px" : "112px",
					height
				}}
			>
				{rooms?.map((room, idx) => {
					if (!room?.user) {
						return;
					}
					const { id, username, avatar, status } = room.user
					return (
						<Link
							key={idx}
							className={`link user-links ${selectedRoom?.user.id === id ? "active" : ""}`}
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
