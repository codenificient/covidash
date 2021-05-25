import React from 'react';
import Country from '../Country/Country';
import './countryList.css';

const CountryList = ({ stats }) => {
	return (
		<div className="showCountry">
			{stats.map((country) => <Country key={country.countryCode} stats={country} />)}
		</div>
	);
};

export default CountryList;
