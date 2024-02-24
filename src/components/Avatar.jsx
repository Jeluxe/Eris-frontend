import defaultAvatar from "../assets/pngegg.png";

const Avatar = ({
	userAvatar,
	size,
	hide,
	bgColor: background,
	absolute = false
}) => {
	return (
		<img
			style={{
				background,
				position: absolute ? "absolute" : "none"
			}}
			className={`image ${hide}`}
			alt="User Avatar"
			src={userAvatar || defaultAvatar}
			width={size}
			height={size}
		/>
	);
};

export default Avatar;
