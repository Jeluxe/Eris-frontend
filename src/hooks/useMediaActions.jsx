import { useEffect, useState } from "react";

export const useMediaActions = () => {
	const initializedValue = localStorage.getItem("muted")
		? JSON.parse(localStorage.getItem("muted"))
		: false;
	const [mute, setMute] = useState(initializedValue);
	const [muted, setMuted] = useState(false);
	const [deaf, setDeaf] = useState(false);
	const [video, setVideo] = useState(false);

	useEffect(() => {
		if (!deaf && mute && muted) {
			setMute(true);
		} else if (deaf && !mute && !muted) {
			setMute(true);
		} else if (!deaf && mute && !muted) {
			setMute(false);
		}
	}, [deaf]);

	useEffect(() => {
		if (deaf && !mute) {
			setDeaf(false);
			setMuted(false);
		} else if (mute && !deaf) {
			setMuted(true);
		} else if (!mute && !deaf) {
			setMuted(false);
		}
	}, [mute]);

	return { video, setVideo, mute, setMute, deaf, setDeaf };
};
