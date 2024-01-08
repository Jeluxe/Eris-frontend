import { useEffect, useState } from "react";

export const useMediaActions = () => {
	const [mute, setMute] = useState(false);
	const [muted, setMuted] = useState(false);
	const [deaf, setDeaf] = useState(false);
	const [video, setVideo] = useState(false);

	useEffect(() => {
		setVideo(!video)
	}, [video])

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
