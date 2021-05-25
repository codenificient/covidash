// import React from 'react';
// import './App.css';
// import CountryList from './Components/CountryList/CountryList';
// import SearchBox from './Components/SearchBox/SearchBox';

// class App extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			stats: [],
// 			countries: [],
// 			searchField: ''
// 		};
// 	}

// 	async componentDidMount() {
// 		const response = await fetch('https://api.covid19api.com/countries');
// 		const countries = await response.json();
// 		this.setState({ countries });
// 	console.log({countries});
// 		this.state.countries.forEach(async (country) => {
// 			// get the latest data about each country
// 			const response = await fetch(`https://api.covid19api.com/live/country/${country.Slug}`);
// 			const data = await response.json();
// 			const total = parseInt(data.Confirmed);
// 			const healthy = parseInt(data.Recovered);
// 			const deceased = parseInt(data.Deaths);
// 			const actives = parseInt(data.Active);
// 			const countryCode = data.CountryCode;
// 			// console.log(actives);

// 			// the data is missing country name. make another request to fetch country name
// 			const name = data.Country;

// 			// console.log(name);
// 			console.log({data});
// 			if (data)
// 				this.setState((prevState) => ({
// 					stats: prevState.stats.concat({ name, countryCode, total, healthy, deceased, actives })
// 				}));
// 		});
// 	}
// 	handleChange = (e) => this.setState({ searchField: e.target.value });

// 	render() {
// 		const { searchField, stats } = this.state;
// 		const filteredCountries = stats.filter((stats) => stats.name.toLowerCase().includes(searchField.toLowerCase()));
// 		return (
// 			<div className="App">
// 				<h1 className="dashboard text-center">Covid 2019 Dashboard</h1>
// 				<p className="text-beige text-center">
// 					This dashboard is powered by data from{' '}
// 					<a href="https://covid19-api.org/" target="_blank">
// 						Covid19 API.org
// 					</a>{' '}
// 					and flags from{' '}
// 					<a href="https://www.countryflags.io" target="_blank">
// 						Country Flags.io
// 					</a>
// 				</p>
// 				<SearchBox
// 					placeholder="Search by country name.."
// 					handleChange={this.handleChange}
// 					className="search-box"
// 				/>

// 				<CountryList stats={filteredCountries} />

// 				<div className="allproject text-center">
// 					<a href="https://tioye.dev/dist/projects/allproject.html" target="_blank" rel="noreferrer">
// 						View my other projects
// 					</a>
// 				</div>
// 			</div>
// 		);
// 	}
// }

// export default App;
