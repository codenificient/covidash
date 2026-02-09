# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Covidash is a React 19 COVID-19 statistics dashboard that fetches CSV data from the Johns Hopkins University CSSE GitHub repository, parses it with `csvtojson`, and displays per-country stats with flag images. Deployed to GitHub Pages at https://codenificient.github.io/covidash/.

## Commands

- **Dev server:** `npm start`
- **Build:** `npm run build`
- **Tests:** `npm test` (runs in watch mode; `npm test -- --watchAll=false` for CI)
- **Single test:** `npm test -- --testPathPattern=<pattern>`
- **Deploy:** `npm run deploy` (builds then pushes to `gh-pages` branch)

All scripts use `react-app-rewired` (not `react-scripts` directly) to apply Node.js polyfill overrides in `config-overrides.js`.

## Architecture

**Build tooling:** Create React App + `react-app-rewired`. The `config-overrides.js` adds webpack polyfills for Node.js built-in modules (`stream`, `buffer`, `util`, etc.) needed by `csvtojson` in the browser.

**Data flow:**
1. `src/index.js` — Initializes analytics SDK (`@codenificient/analytics-sdk`) with ad-blocker resilience, sets `window.analytics` globally, renders `<App />` via React 19 `createRoot`
2. `src/App.js` — Class component. On mount, fetches CSV from GitHub via `fetch()` + `csvtojson().fromString()`, parses country data (confirmed, deaths, recovered, active), stores in `this.state.stats`. Supports search filtering via `SearchBox`
3. `src/Components/CountryList/CountryList.js` — Maps stats array to `Country` components
4. `src/Components/Country/Country.js` — Displays individual country card with flag image from flagcdn.com. Contains a hardcoded `Map` of country name → ISO code overrides for flag lookups
5. `src/Components/SearchBox/SearchBox.js` — Controlled search input

**Styling:** CSS custom properties defined in `src/App.css` (dark theme with `--bg-grey1`, `--bg-grey2`, `--bg-main`). Each component has a co-located CSS file. Fonts: Niconne (headings), Poppins (body).

**Flags:** Country flags loaded from `flagcdn.com/h120/{code}.png`. The `Country` component maintains a manual Map of country-name-to-ISO-code overrides when the CSV's ISO3 code doesn't match the flag API's expected 2-letter code.

**Analytics:** Uses `window.analytics` global (set up in `index.js`). Components access it via `window.analytics.track()`. The setup includes ad-blocker detection, retry logic with exponential backoff, and localStorage fallback (`window.localAnalytics`).

## Key Gotchas

- There are no tests currently in the project.
- `App.js` uses a class component (not hooks) — `componentDidMount` for data fetching.
- The CSV data source URL points to `CSSEGISandData/COVID-19` which is archived; the data is static/historical.
- `npm install` requires `--legacy-peer-deps` due to a typescript peer dependency conflict between `react-scripts` and `@codenificient/analytics-sdk`.
