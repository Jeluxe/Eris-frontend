import { useEffect, useRef } from "react";

const Video = ({ type, id = null, muted = null, stream = null, videoOn }) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (stream && videoRef.current) {
			videoRef.current.srcObject = stream;
		}
	}, [stream])

	return <div id={id ? `td-${id}` : `${type}Video`} className={`${type} ${type === 'local' ? videoOn ? "" : "hide" : ""}`}>
		<video id={id} ref={videoRef} muted={muted} autoPlay width={200} className="video"></video>
		{/* {type === "local" ? <video ref={shareScreenRef} muted autoPlay></video> : ""} */}
	</div>;
};

export default Video;
