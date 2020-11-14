import React from 'react';
import './country.css';

const Country = ({ stats }) => {
	return (
		<div className="country">
			<img src={`https://www.countryflags.io/${stats.data.country}/flat/64.png`} alt={`Flag of ${stats.name}`} />
			<h2>{stats.name}</h2>
			<div className="cases">
				<p>{`Confirmed : ${stats.data.cases}`}</p>
				<p>{`Deaths : ${stats.data.deaths}`}</p>
				<p>{`Recovered : ${stats.data.recovered}`}</p>
			</div>
		</div>
	);
};

export default Country;
