import React from "react";
import "./App.css";
import CountryList from "./Components/CountryList/CountryList";
import SearchBox from "./Components/SearchBox/SearchBox";
// Analytics will be accessed via window.analytics
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
    // Track data loading start
    if (window.analytics) {
      window.analytics
        .track("data_loading_started", {
          app_name: "CoviDash",
          data_source: "John Hopkins University",
        })
        .catch((error) => {
          console.warn("Analytics track failed:", error);
        });
    }

    const responseJSON = await csv().fromStream(
      request.get(
        "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/web-data/data/cases_country.csv"
      )
    );

    // console.log(responseJSON);
    this.setState({
      countries: responseJSON,
    });

    // Track data loading completion
    if (window.analytics) {
      window.analytics
        .track("data_loading_completed", {
          app_name: "CoviDash",
          countries_loaded: responseJSON.length,
          data_source: "John Hopkins University",
        })
        .catch((error) => {
          console.warn("Analytics track failed:", error);
        });
    }

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
  handleChange = (e) => {
    const searchValue = e.target.value;
    this.setState({ searchField: searchValue });

    // Track search interactions
    if (searchValue.length > 0 && window.analytics) {
      window.analytics
        .track("search_performed", {
          app_name: "CoviDash",
          search_term: searchValue,
          search_length: searchValue.length,
        })
        .catch((error) => {
          console.warn("Analytics track failed:", error);
        });
    }
  };

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
            onClick={() =>
              window.analytics &&
              window.analytics
                .track("external_link_clicked", {
                  app_name: "CoviDash",
                  link_type: "data_source",
                  link_url: "https://github.com/CSSEGISandData/COVID-19",
                  link_text: "John Hopkins University",
                })
                .catch((error) => {
                  console.warn("Analytics track failed:", error);
                })
            }
          >
            John Hopkins University
          </a>{" "}
          and flags from{" "}
          <a
            href="https://flagpedia.net"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              window.analytics &&
              window.analytics
                .track("external_link_clicked", {
                  app_name: "CoviDash",
                  link_type: "resource",
                  link_url: "https://flagpedia.net",
                  link_text: "Flagpedia.net",
                })
                .catch((error) => {
                  console.warn("Analytics track failed:", error);
                })
            }
          >
            Flagpedia.net
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
            href="https://tioye.dev/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              window.analytics &&
              window.analytics
                .track("external_link_clicked", {
                  app_name: "CoviDash",
                  link_type: "portfolio",
                  link_url: "https://tioye.dev/portfolio",
                  link_text: "View my other projects",
                })
                .catch((error) => {
                  console.warn("Analytics track failed:", error);
                })
            }
          >
            View my other projects
          </a>
        </div>
      </div>
    );
  }
}

export default App;
