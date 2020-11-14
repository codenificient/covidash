import React from 'react';
import './searchbox.css';

const SearchBox = ({ placeholder, handleChange }) => {
	return (
		<div className="search-box">
			<input
				type="search"
				className="search"
				placeholder={placeholder}
				onChange={handleChange}
			/>
		</div>
	);
};

export default SearchBox;
