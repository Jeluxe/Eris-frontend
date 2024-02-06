import { useEffect, useRef } from "react";

const Video = ({ type, id = null, stream, videoToggle }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream])

	return (<>{stream ? <div id={id ? `td-${id}` : `${type}Video`} className={`${type} ${type === 'local' ? videoToggle ? "" : "hide" : ""}`}>
		<video id={id} ref={videoRef} muted={type === "local" ? true : false} autoPlay width={230} className="video"></video>
	</div> : ""}</>)
};

export default Video;
