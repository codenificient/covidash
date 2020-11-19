import React from 'react';
import './country.css';

const Country = ({ stats }) => {
	return (
		<div className="country">
			<img src={`https://www.countryflags.io/${stats.countryCode}/flat/64.png`} alt={`Flag of ${stats.name}`} />
			<h2>{stats.name}</h2>
			<div className="cases">
				<p>{`Confirmed : ${stats.total}`}</p>
				<p>{`Deaths : ${stats.deceased}`}</p>
				<p>{`Recovered : ${stats.healthy}`}</p>
				<p>{`Active : ${stats.actives}`}</p>
			</div>
		</div>
	);
};

export default Country;
