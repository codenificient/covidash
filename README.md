# Covidash

A COVID-19 statistics dashboard built with React 19 that displays per-country case data with flags, powered by archived data from Johns Hopkins University CSSE.

[![Live Site](https://api.microlink.io/?url=https%3A%2F%2Fcodenificient.github.io%2Fcovidash%2F&screenshot=true&meta=false&embed=screenshot.url&delay=3000)](https://codenificient.github.io/covidash/)

## Live Demo

**[codenificient.github.io/covidash](https://codenificient.github.io/covidash/)**

## Tech Stack

- **React 19** with Create React App + react-app-rewired
- **csvtojson** for parsing CSV data via native `fetch()`
- **@codenificient/analytics-sdk v1.1** for telemetry tracking
- **GitHub Pages** for deployment

## Features

- Displays confirmed cases and deaths for 190+ countries
- Country flags from flagcdn.com
- Real-time search filtering by country name
- Analytics tracking with ad-blocker resilience and localStorage fallback
- Dark theme UI

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Data Source

COVID-19 data from the [Johns Hopkins University CSSE](https://github.com/CSSEGISandData/COVID-19) repository (archived). The dashboard fetches CSV data from the `web-data` branch and parses it client-side.

## Architecture

```
src/
  index.js          - App entry, analytics SDK v1.1 init, React 19 createRoot
  App.js            - Main component, CSV fetch + parse, search state
  setupProxy.js     - CRA dev proxy for analytics (CORS bypass)
  Components/
    CountryList/    - Renders grid of Country cards
    Country/        - Individual country card with flag + stats
    SearchBox/      - Search input for filtering
```

## Author

**Christian Tioye** - [tioye.dev](https://tioye.dev/portfolio)
