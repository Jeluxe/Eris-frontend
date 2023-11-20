import { useStateProvider } from "../context";

const Checkbox = ({ target }) => {
	const { selectedFilter, setSelectedFilter } = useStateProvider()
	return (
		<>
			<input
				className="navbar-category"
				id={target}
				type="radio"
				name="radio"
				onChange={() => { }}
				checked={selectedFilter === target}
			/>
			<label
				htmlFor={target}
				className="navbar-category-label"
				onClick={() => setSelectedFilter(target)}
			>
				{target}
			</label>
		</>
	);
};

export default Checkbox;
