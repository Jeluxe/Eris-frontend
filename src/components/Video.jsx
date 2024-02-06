import { useEffect, useRef } from "react";

const Video = ({ type, id = null, stream, videoToggle }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream])

	return (<>{stream ?
		<video
			ref={videoRef}
			id={id ? `td-${id}` : `${type}Video`}
			autoPlay
			muted={type === "local" ? true : false}
			className={`video ${type} ${type === 'local' ? videoToggle ? "" : "hide" : ""}`}
		></video>
		: ""}</>)
};

export default Video;
