import React from "react";
import { useNavigate } from "react-router";

const Settings = () => {
	const navigate = useNavigate();

	return (
		<div>
			<div onClick={() => navigate(-1)}>X</div>
			Settings
			<div>
				<label title="theme" content="theme" htmlFor="" />
				<input id="theme" type="checkbox" />
			</div>
		</div>
	);
};

export default Settings;
