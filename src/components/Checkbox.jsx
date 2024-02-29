import { useStateProvider } from "../context";

const Checkbox = ({ target }) => {
	const { selectedFilter, setSelectedFilter } = useStateProvider();

	const handleChange = () => {
		setSelectedFilter(target);
	}

	return (
		<>
			<input
				className="navbar-category"
				id={target}
				type="radio"
				name="radio"
				onChange={handleChange}
				checked={selectedFilter === target}
				aria-checked={selectedFilter === target ? "true" : "false"}
			/>
			<label
				htmlFor={target}
				className="navbar-category-label"
				onClick={handleChange}
				tabIndex="0"
				role="button"
			>
				{target}
			</label>
		</>
	);
};

export default Checkbox;
