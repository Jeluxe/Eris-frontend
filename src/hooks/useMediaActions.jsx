import { useEffect, useState } from "react";

export const useMediaActions = () => {
	const initializedValue = localStorage.getItem("muted")
		? JSON.parse(localStorage.getItem("muted"))
		: false;
	const [muteToggle, setMuteToggle] = useState(initializedValue);
	const [muted, setMuted] = useState(false);
	const [deafToggle, setDeafToggle] = useState(false);
	const [videoToggle, setVideoToggle] = useState(false);

	useEffect(() => {
		if (!deafToggle && muteToggle && muted) {
			setMuteToggle(true);
		} else if (deafToggle && !muteToggle && !muted) {
			setMuteToggle(true);
		} else if (!deafToggle && muteToggle && !muted) {
			setMuteToggle(false);
		}
	}, [deafToggle]);

	useEffect(() => {
		if (deafToggle && !muteToggle) {
			setDeafToggle(false);
			setMuted(false);
		} else if (muteToggle && !deafToggle) {
			setMuted(true);
		} else if (!muteToggle && !deafToggle) {
			setMuted(false);
		}
	}, [muteToggle]);

	return { videoToggle, setVideoToggle, muteToggle, setMuteToggle, deafToggle, setDeafToggle };
};
