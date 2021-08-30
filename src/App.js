import React from 'react';
import './App.css';
import CountryList from './Components/CountryList/CountryList';
import SearchBox from './Components/SearchBox/SearchBox';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			stats: [],
			countries: [],
			searchField: ''
		};
	}

	async componentDidMount() {
		const response = await fetch('https://www.trackcorona.live/api/countries');
		const countries = await response.json();
		this.setState({ countries });
		// console.log({ countries });
		this.state.countries.data.map(async (country) => {
			// get the latest data about each country
			const total = parseInt(country.confirmed);
			const healthy = parseInt(country.recovered);
			const dead = parseInt(country.dead);
			const actives = total - (dead + healthy);
			const countryCode = country.country_code;
			// console.log(actives);

			// the data is missing country name. make another request to fetch country name
			const name = country.location;

			// console.log(name);
			// console.log({ country });
			if (country)
				this.setState((prevState) => ({
					stats: prevState.stats.concat({ name, countryCode, total, healthy, dead, actives })
				}));
		});
	}
	handleChange = (e) => this.setState({ searchField: e.target.value });

	render() {
		const { searchField, stats } = this.state;
		const filteredCountries = stats.filter((stats) => stats.name.toLowerCase().includes(searchField.toLowerCase()));
		return (
			<div className="App">
				<h1 className="dashboard text-center">Covid 2019 Dashboard</h1>
				<p className="text-beige text-center">
					This dashboard is powered by data from{' '}
					<a href="https://www.trackcorona.live/" target="_blank">
						TrackCorona
					</a>{' '}
					and flags from{' '}
					<a href="https://www.countryflags.io" target="_blank">
						Country Flags.io
					</a>
				</p>
				<SearchBox
					placeholder="Search by country name.."
					handleChange={this.handleChange}
					className="search-box"
				/>

				<CountryList stats={filteredCountries} />

				<div className="allproject text-center">
					<a href="https://tioye.dev/pages/projects/allproject.html" target="_blank" rel="noreferrer">
						View my other projects
					</a>
				</div>
			</div>
		);
	}
}

export default App;
