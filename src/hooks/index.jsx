import { useEffect, useState } from "react";

export const useAudioActions = () => {
	const [mute, setMute] = useState(false);
	const [muted, setMuted] = useState(false);
	const [deaf, setDeaf] = useState(false);

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

	return { mute, setMute, deaf, setDeaf };
};
