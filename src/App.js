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
		const response = await fetch('https://covid19-api.org/api/countries');
		const countries = await response.json();
		this.setState({ countries });
		// console.log(countries);
		this.state.countries.forEach(async (country) => {
			// get the latest data about each country
			const response = await fetch(`https://covid19-api.org/api/status/${country.alpha2}`);
			const data = await response.json();
			const total = parseInt(data.cases);
			const healthy = parseInt(data.recovered);
			const deceased = parseInt(data.deaths);
			const actives = total - (healthy + deceased);
			const countryCode = data.country;
			// console.log(actives);

			// the data is missing country name. make another request to fetch country name
			const resp = await fetch(`https://covid19-api.org/api/country/${country.alpha2}`);
			const respjs = await resp.json();
			const name = respjs.name;

			// console.log(name);
			// console.log(data);
			if (data)
				this.setState((prevState) => ({
					stats: prevState.stats.concat({ name, countryCode, total, healthy, deceased, actives })
				}));
		});
	}
	handleChange = (e) => this.setState({ searchField: e.target.value });

	render() {
		const { searchField, stats } = this.state;
		const filteredCountries = stats.filter((stats) => stats.name.toLowerCase().includes(searchField.toLowerCase()));
		return (
			<div className="App">
				<h1 className="dashboard">Covid 2019 Dashboard</h1>
				<p className="text-beige">
					This dashboard is powered by data from{' '}
					<a href="https://covid19-api.org/" target="_blank">
						Covid19 API.org
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

				<div className="allproject">
					<a href="https://tioye.dev/dist/projects/allproject.html" target="_blank" rel="noreferrer">
						View my other projects
					</a>
				</div>
			</div>
		);
	}
}

export default App;
