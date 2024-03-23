import { useEffect, useRef } from "react";
import { useSocketIOProvider, } from "../context";
import Avatar from "./Avatar";

const Video = ({ type, id = null, stream, videoToggle }) => {
	const { addSocketEvent, removeSocketEvent } = useSocketIOProvider();
	const videoRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		addSocketEvent("video-toggle", toggleVideo)

		return () => {
			removeSocketEvent("video-toggle");
		}
	}, []);

	useEffect(() => {
		if (stream) {
			const videoTrack = stream.getVideoTracks();
			hideShowVideoInit(!videoTrack.length)
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	const toggleVideo = () => {
		videoRef.current.classList.toggle("hide");
		containerRef.current.querySelector("img").classList.toggle("hide");
	}

	const hideShowVideoInit = (value) => {
		if (value) {
			videoRef.current.classList.add("hide");
			containerRef.current.querySelector("img").classList.remove("hide");
		} else {
			videoRef.current.classList.remove("hide");
			containerRef.current.querySelector("img").classList.add("hide");
		}
	}

	if (!stream) {
		return null; // No stream, return null
	}

	return (
		<div ref={containerRef} style={{ position: "relative", display: "flex" }}>
			<video
				ref={videoRef}
				id={id ? `td-${id}` : `${type}Video`}
				autoPlay
				muted={type === "local"}
				className={`video ${type} ${type === 'local' ? videoToggle ? "" : "hide" : ""}`}
			></video>
			<Avatar size={85} hide={type === "local" ? videoToggle ? "hide" : "" : "hide"} />
		</div>
	);
};

export default Video;
