import { useEffect, useRef } from "react";
import { useSocketIOProvider, } from "../context";
import Avatar from "./Avatar";

const Video = ({ type, id = null, stream, videoToggle }) => {
	const { addSocketEvent, removeSocketEvent } = useSocketIOProvider()
	const videoRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		addSocketEvent("video-toggle", () => {
			videoRef.current.classList.toggle("hide");
			containerRef.current.querySelector("img").classList.toggle("hide")
		})

		return () => {
			removeSocketEvent("video-toggle")
		}
	}, [])

	useEffect(() => {
		if (stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream])

	return (<>{stream ?
		<div ref={containerRef} style={{ position: "relative", display: "flex" }}>
			<video
				ref={videoRef}
				id={id ? `td-${id}` : `${type}Video`}
				autoPlay
				muted={type === "local" ? true : false}
				className={`video ${type} ${type === 'local' ? videoToggle ? "" : "hide" : ""}`}
			></video>
			<Avatar size={85} hide={type === "local" ? videoToggle ? "hide" : "" : "hide"} />
		</div>
		: ""}</>)
};

export default Video;
