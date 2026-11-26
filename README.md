# best-national-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/Tuapaaas/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/Tuapaaas/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaData — Statistik Indonesia: a national statistics site for Indonesia, original and working, that runs offline in a web browser on a desktop and on a phone from its own files. Population, economy, health, education and environment, with real figures, charts drawn in code, and every figure sourced by year.

## Run it

```sh
python3 -m http.server 8080 --directory app
```

Then open http://localhost:8080 in a browser.

## What it is

- **Overview** — nine key indicators (population, GDP, growth, inflation, unemployment, poverty, life expectancy, HDI) with a US$/Rp switch, population and growth charts.
- **Population** — age pyramid, age-group table, and a searchable table of the 18 largest provinces.
- **Economy** — GDP by sector (donut) with a switch to the 2019–2024 growth chart, inflation bars, and the 2024 trade balance.
- **People** — health and education: literacy, schooling, infant mortality, stunting, health facilities, internet users.
- **Environment** — forest area and loss, CO₂ emissions, renewables, protected land.
- **Sources & methods** — where every figure comes from.

Everything is static files under `app/` (no build step, no network request, no tracking). Charts are SVG drawn in code from the data in `app/data.js`.

## Build the hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=c1kkm475&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
