import { useEffect, useState } from "react";

export const useMediaActions = () => {
	const mutedLS = localStorage.getItem("muted");
	const deafLS = localStorage.getItem("deaf");
	const [muteToggle, setMuteToggle] = useState(mutedLS ? JSON.parse(mutedLS) : false);
	const [muted, setMuted] = useState(mutedLS ? JSON.parse(mutedLS) : false);
	const [deafToggle, setDeafToggle] = useState(deafLS ? JSON.parse(deafLS) : false);
	const [videoToggle, setVideoToggle] = useState(false);

	useEffect(() => {
		localStorage.setItem("deaf", deafToggle)
		if (!deafToggle && muteToggle && muted) {
			setMuteToggle(true);
		} else if (deafToggle && !muteToggle && !muted) {
			setMuteToggle(true);
		} else if (!deafToggle && muteToggle && !muted) {
			setMuteToggle(false);
		}
	}, [deafToggle]);

	useEffect(() => {
		localStorage.setItem("muted", muteToggle)
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
