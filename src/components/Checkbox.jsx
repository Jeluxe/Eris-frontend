import React, { useContext } from "react";
import { Context } from "../context";

const Checkbox = ({ target }) => {
	const { selected, setSelected } = useContext(Context)
	return (
		<>
			<input
				className="navbar-category"
				id={target}
				type="radio"
				name="radio"
				onChange={() => { }}
				checked={selected === target}
			/>
			<label
				htmlFor={target}
				className="navbar-category-label"
				onClick={() => setSelected(target)}
			>
				{target}
			</label>
		</>
	);
};

export default Checkbox;
