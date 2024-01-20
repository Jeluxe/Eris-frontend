import { forwardRef, useEffect, useRef } from "react";

const Video = forwardRef(({ type, id = null, muted = null, remoteStream = null }, ref) => {
	const videoRef = useRef(null);

	useEffect(() => {
		if (remoteStream && videoRef.current) {
			videoRef.current.srcObject = remoteStream;
		}
	}, [remoteStream])

	return <div id={id ? `td-${id}` : `${type}Video`} className={type}>
		<video id={id} ref={ref ?? videoRef} muted={muted} autoPlay className="video"></video>
		{/* {type === "local" ? <video ref={shareScreenRef} muted autoPlay></video> : ""} */}
	</div>;
});

export default Video;
