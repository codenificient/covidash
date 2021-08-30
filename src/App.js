import React from "react";
import "./App.css";
import CountryList from "./Components/CountryList/CountryList";
import SearchBox from "./Components/SearchBox/SearchBox";
const csv = require("csvtojson");
const request = require("request");
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      stats: [],
      response: null,
      countries: [],
      searchField: "",
    };
  }

  async componentDidMount() {
    const responseJSON = await csv().fromStream(
      request.get(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv"
      )
    );

    console.log(responseJSON);
    this.setState({
      countries: responseJSON,
    });

    this.state.countries.map(async (country) => {
      // get the latest data about each country
      const total = parseInt(country.Confirmed, 10);
      const healthy = parseInt(country.Recovered, 10)
        ? parseInt(country.Recovered, 10)
        : 0;
      const dead = parseInt(country.Deaths, 10);
      const actives = total - (dead + healthy);
      const countryCode = country.ISO3.substring(0, 2);
      // console.log(actives);

      // the data is missing country name. make another request to fetch country name
      const name = country.Country_Region;

      // console.log(name);
      // console.log({ country });
      if (country)
        this.setState((prevState) => ({
          stats: prevState.stats.concat({
            name,
            countryCode,
            total,
            healthy,
            dead,
            actives,
          }),
        }));
    });
  }
  handleChange = (e) => this.setState({ searchField: e.target.value });

  render() {
    const { searchField, stats } = this.state;
    const filteredCountries = stats.filter((stat) =>
      stat.name.toLowerCase().includes(searchField.toLowerCase())
    );
    return (
      <div className="App">
        <h1 className="dashboard text-center">Covid 2019 Dashboard</h1>
        <p className="text-beige text-center">
          This dashboard is powered by data from{" "}
          <a
            href="https://github.com/CSSEGISandData/COVID-19"
            target="_blank"
            rel="noopener noreferrer"
          >
            John Hopkins University
          </a>{" "}
          and flags from{" "}
          <a
            href="https://www.countryflags.io"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          <a
            href="https://tioye.dev/pages/projects/allproject.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            View my other projects
          </a>
        </div>
      </div>
    );
  }
}

export default App;
