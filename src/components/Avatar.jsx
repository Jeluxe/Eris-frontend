import defaultAvatar from "../assets/pngegg.png";

const Avatar = ({
	userAvatar,
	size,
	bgColor: background,
	absolute = false
}) => {
	return (
		<img
			style={{
				background,
				position: absolute ? "absolute" : "none"
			}}
			className="image"
			alt="User Avatar"
			src={userAvatar || defaultAvatar}
			width={size}
			height={size}
		/>
	);
};

export default Avatar;
