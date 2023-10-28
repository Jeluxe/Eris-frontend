import userAvatar from "../assets/pngegg.png";

const Avatar = ({
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
			src={userAvatar}
			width={size}
			height={size}
		/>
	);
};

export default Avatar;
