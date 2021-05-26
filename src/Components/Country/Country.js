import React from 'react';
import './country.css';

const Country = ({ stats }) => {
	return (
		<div className="country">
			<img src={`https://www.countryflags.io/${stats.countryCode}/flat/64.png`} alt={`Flag of ${stats.name}`} />
			<h2>{stats.name}</h2>
			<div className="cases">
				<p>
					{`Confirmed : `}
					<span className="qty">{stats.total}</span>
				</p>
				<p>
					{`Active : `}
					<span className="qty">{stats.actives}</span>
				</p>
				<p>
					{`Deaths : `}
					<span className="qty">{stats.dead}</span>
				</p>
				<p>
					{`Recovered : `}
					<span className="qty">{stats.healthy}</span>
				</p>
			</div>
		</div>
	);
};

export default Country;
