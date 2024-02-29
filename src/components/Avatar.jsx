import defaultAvatar from "../assets/pngegg.png";

const Avatar = ({
	avatar = defaultAvatar,
	size,
	hide = "",
	bgColor = "",
	absolute = false
}) => {
	return (
		<img
			style={{
				background: bgColor,
				position: absolute ? "absolute" : "none"
			}}
			className={`image ${hide}`}
			alt="User Avatar"
			src={avatar}
			width={size}
			height={size}
		/>
	);
};

export default Avatar;
