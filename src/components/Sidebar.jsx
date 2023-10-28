import { useEffect, useState } from "react";
import { Link, useMatches } from "react-router-dom";
import { FriendsIcon, CloseIcon } from "../assets/icons";
import { getUsers } from "../functions";
import { Avatar, HDivider } from "./";

const Sidebar = ({ smallDevice, height, call, setBurgerMenu }) => {
	const matches = useMatches()
	const [array] = useState(getUsers());
	const [selected, setSelected] = useState("");

	const activeLink = (name) => {
		smallDevice ? setBurgerMenu(false) : "";
		setSelected(name)
	};

	useEffect(() => {

	}, [matches])


	return (
		<div className="sidebar">
			<div className="sidebar-top">
				<Link
					to="/"
					className="link friends-link"
					onClick={() => activeLink("")}
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
					minHeight: call ? "412px" : "112px",
					height
				}}
			>
				{array.map(({ name, color }, idx) => {
					return (
						<Link
							key={idx}
							className={`link user-links ${selected === name ? "active" : ""}`}
							to={`/@me/${name}/${color?.substring(1, color.length)}`}
							onClick={() => activeLink(name)}
						>
							<Avatar
								size={35}
								bgColor={color}
							/>
							<p>{name}</p>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default Sidebar;
