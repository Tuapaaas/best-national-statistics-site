// NusaData — router and page renderers. Hash routes: #/ (overview),
// #/population, #/economy, #/people, #/environment, #/sources. Every page
// is rendered from DATA (data.js) and CHART (charts.js); every control on
// a page does what it says: the GDP unit switch, the province search and
// the economy chart switch all work without a network request.
(function () {
  var view = document.getElementById("view");
  var navLinks = document.querySelectorAll("[data-route]");

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function statCard(item) {
    return '<article class="card"><p class="card-label">' + esc(item.label) +
      '</p><p class="card-value">' + esc(item.value) + '</p><p class="card-note">' +
      esc(item.note || item.source || "") + '</p></article>';
  }

  function sectionHead(title, sub) {
    return '<h2>' + esc(title) + '</h2><p class="lede">' + esc(sub) + '</p>';
  }

  function renderOverview() {
    var cards = DATA.overview.map(function (item) {
      if (item.label === "GDP") {
        return '<article class="card"><p class="card-label">GDP</p>' +
          '<p class="card-value" data-gdp>US$ 1.40 trillion</p>' +
          '<p class="card-note">Rp 22,139 trillion, 2024 · BPS / World Bank</p></article>';
      }
      if (item.label === "GDP per capita") {
        return '<article class="card"><p class="card-label">GDP per capita</p>' +
          '<p class="card-value" data-gdppc>US$ 4,960</p>' +
          '<p class="card-note">Rp 78.6 million, 2024 · BPS</p></article>';
      }
      return statCard(item);
    }).join("");
    return '<section class="hero"><p class="kicker">National statistics · Updated November 2026</p>' +
      '<h1>Indonesia in numbers</h1>' +
      '<p class="lede">One country, 281.6 million people, the world\u2019s fourth-largest population and ' +
      'Southeast Asia\u2019s biggest economy — every figure below with its source and year.</p>' +
      '<p class="unit-switch">Show money in ' +
      '<button type="button" class="pill active" data-unit="usd">US dollars</button> ' +
      '<button type="button" class="pill" data-unit="idr">Rupiah</button></p></section>' +
      '<section class="grid">' + cards + '</section>' +
      '<section class="split">' +
      '<div><h2>Population, 2019–2024</h2>' + CHART.lineChart(
        DATA.populationTrend.map(function (d) { return { label: String(d.year), value: d.pop }; }),
        function (v) { return v.toFixed(0) + "m"; }) +
      '<p class="caption">Population in millions. Source: BPS, 2024.</p></div>' +
      '<div><h2>Real GDP growth</h2>' + CHART.barChart(
        DATA.growth.map(function (d) { return { label: String(d.year), value: d.g }; }),
        function (v) { return v.toFixed(1) + "%"; }) +
      '<p class="caption">Annual real GDP growth, %. Source: BPS, 2024. The 2020 dip is the COVID-19 recession.</p></div>' +
      '</section>' +
      '<section><h2>Explore the country</h2><ul class="explore">' +
      '<li><a href="#/population">Population — age pyramid, provinces, density</a></li>' +
      '<li><a href="#/economy">Economy — sectors, trade, inflation</a></li>' +
      '<li><a href="#/people">People — health, education, work</a></li>' +
      '<li><a href="#/environment">Environment — forests, energy, emissions</a></li>' +
      '<li><a href="#/sources">Sources &amp; methods — where every figure comes from</a></li>' +
      '</ul></section>';
  }

  function renderPopulation() {
    var rows = DATA.provinces.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td class="num">' + p.pop.toFixed(2) + '</td></tr>';
    }).join("");
    var summary = DATA.ageSummary.map(function (g) {
      return '<tr><td>' + esc(g.group) + '</td><td class="num">' + g.share.toFixed(1) + '%</td></tr>';
    }).join("");
    return sectionHead("Population", "281.6 million people (BPS, 2024), growing about 1.0% a year, " +
      "on 1,905,000 km² of land — about 148 people per km². More than half the population " +
      "lives on Java, an island smaller than the UK.") +
      '<section class="split"><div><h2>Age structure, 2024</h2>' +
      CHART.pyramidChart(DATA.ageGroups) +
      '<p class="caption">Share of the total population in each five-year age band. Source: BPS, 2024.</p></div>' +
      '<div><h2>Who is who</h2><table><thead><tr><th>Group</th><th class="num">Share</th></tr></thead>' +
      '<tbody>' + summary + '</tbody></table>' +
      '<p class="lede">Indonesia is young: the median age is about 30, and two in three ' +
      'people are of working age. The urban share is 58.6% (World Bank, 2023).</p></div></section>' +
      '<section><h2>Provinces by population, 2024</h2>' +
      '<p><label class="search-label" for="prov-search">Search provinces</label> ' +
      '<input id="prov-search" type="search" placeholder="Type a province name…" autocomplete="off"></p>' +
      '<table id="prov-table"><thead><tr><th>Province</th><th class="num">Population (millions)</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<p class="caption">18 largest provinces shown; the rest of the 38 provinces hold the remaining ' +
      'population. Source: BPS, 2024.</p></section>';
  }

  function renderEconomy() {
    var trade = DATA.trade.map(function (t) {
      return '<tr><td>' + esc(t.label) + '</td><td class="num">' + esc(t.value) + '</td><td>' + esc(t.source) + '</td></tr>';
    }).join("");
    return sectionHead("Economy", "A US$ 1.40 trillion economy (2024) that grew 5.03% in real terms, " +
      "with inflation of 1.57% and a US$ 31.0 billion trade surplus.") +
      '<section><h2>What the economy is made of</h2>' +
      '<p class="chart-switch"><button type="button" class="pill active" data-chart="sectors">Sectors, 2024</button> ' +
      '<button type="button" class="pill" data-chart="growth">Growth, 2019–2024</button></p>' +
      '<div id="econ-chart">' + CHART.donutChart(DATA.sectors) + '</div>' +
      '<p class="caption">Share of GDP by sector. Source: BPS, 2024.</p></section>' +
      '<section class="split"><div><h2>Inflation, 2019–2024</h2>' + CHART.barChart(
        DATA.inflation.map(function (d) { return { label: String(d.year), value: d.v }; }),
        function (v) { return v.toFixed(1) + "%"; }) +
      '<p class="caption">Consumer price inflation, December year on year. Source: BPS.</p></div>' +
      '<div><h2>Trade, 2024</h2><table><thead><tr><th>Item</th><th class="num">Value</th><th>Source</th></tr></thead>' +
      '<tbody>' + trade + '</tbody></table>' +
      '<p class="lede">Exports are led by coal, palm oil and nickel products; the surplus has ' +
      'run every year since 2020.</p></div></section>';
  }

  function renderPeople() {
    var cards = DATA.people.map(statCard).join("");
    return sectionHead("People", "Health, education and work: how 281.6 million Indonesians live, " +
      "learn and earn.") +
      '<section class="grid">' + cards + '</section>' +
      '<section><h2>Work and welfare</h2><table><thead><tr><th>Indicator</th><th class="num">Value</th><th>Year</th><th>Source</th></tr></thead><tbody>' +
      '<tr><td>Open unemployment rate</td><td class="num">4.76%</td><td>Feb 2025</td><td>BPS</td></tr>' +
      '<tr><td>Poverty rate</td><td class="num">8.57%</td><td>Sep 2024</td><td>BPS</td></tr>' +
      '<tr><td>Gini coefficient</td><td class="num">0.379</td><td>Mar 2024</td><td>BPS</td></tr>' +
      '<tr><td>Human Development Index</td><td class="num">75.02</td><td>2024</td><td>BPS</td></tr>' +
      '<tr><td>Life expectancy at birth</td><td class="num">74.0 years</td><td>2024</td><td>BPS</td></tr>' +
      '</tbody></table><p class="caption">Poverty and inequality have fallen steadily since the 2015 peak; ' +
      'unemployment is at its lowest since the 1990s.</p></section>';
  }

  function renderEnvironment() {
    var cards = DATA.environment.map(statCard).join("");
    return sectionHead("Environment", "The world\u2019s third-largest tropical forest, 17,000 islands, " +
      "and an energy transition under way.") +
      '<section class="grid">' + cards + '</section>' +
      '<section><h2>Forests and climate</h2><p class="lede">Indonesia holds about 95.6 million hectares ' +
      'of forest (2023) — roughly half its land. Net forest loss in 2022–2023 was 0.10 million hectares, ' +
      'down sharply from the 2015 peak, while renewables reached 19.4% of primary energy in 2023 and ' +
      'about 22% of land is protected. CO₂ emissions are about 0.7 gigatonnes a year (2023), ' +
      'mostly from land use and energy.</p></section>';
  }

  function renderSources() {
    var rows = DATA.sources.map(function (s) {
      return '<tr><td>' + esc(s.figure) + '</td><td>' + esc(s.origin) + '</td></tr>';
    }).join("");
    return sectionHead("Sources & methods", "Every figure on this site comes from a published source. " +
      "Values are rounded for display; where a figure is approximate it is marked ≈. " +
      "Population and economic figures are from Statistics Indonesia (BPS); international " +
      "comparisons use the World Bank and UN agencies.") +
      '<section><table><thead><tr><th>Figures</th><th>Source</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="lede">Methods: population is the BPS mid-year estimate; GDP is nominal in current prices; ' +
      'growth is real GDP change; inflation is the consumer price index, December year on year; ' +
      'poverty uses the BPS poverty line; the Human Development Index is the BPS IPM on a 0–100 scale.</p>' +
      '<p class="lede">NusaData is an independent, original presentation of public statistics. ' +
      'It is not affiliated with BPS, the World Bank or the United Nations.</p></section>';
  }

  var routes = {
    "/": { title: "Indonesia in numbers — NusaData", render: renderOverview },
    "/population": { title: "Population — NusaData", render: renderPopulation },
    "/economy": { title: "Economy — NusaData", render: renderEconomy },
    "/people": { title: "People — NusaData", render: renderPeople },
    "/environment": { title: "Environment — NusaData", render: renderEnvironment },
    "/sources": { title: "Sources & methods — NusaData", render: renderSources }
  };

  function currentRoute() {
    var hash = window.location.hash || "#/";
    var path = hash.slice(1) || "/";
    return routes[path] ? path : "/";
  }

  function bindControls() {
    var search = document.getElementById("prov-search");
    if (search) {
      search.addEventListener("input", function () {
        var q = search.value.trim().toLowerCase();
        var rows = document.querySelectorAll("#prov-table tbody tr");
        rows.forEach(function (row) {
          row.style.display = row.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
        });
      });
    }
    var unitBtns = document.querySelectorAll("[data-unit]");
    unitBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        unitBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var gdp = document.querySelector("[data-gdp]");
        var gdppc = document.querySelector("[data-gdppc]");
        if (btn.getAttribute("data-unit") === "idr") {
          if (gdp) gdp.textContent = "Rp 22,139 trillion";
          if (gdppc) gdppc.textContent = "Rp 78.6 million";
        } else {
          if (gdp) gdp.textContent = "US$ 1.40 trillion";
          if (gdppc) gdppc.textContent = "US$ 4,960";
        }
      });
    });
    var chartBtns = document.querySelectorAll("[data-chart]");
    chartBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        chartBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var box = document.getElementById("econ-chart");
        if (!box) return;
        if (btn.getAttribute("data-chart") === "growth") {
          box.innerHTML = CHART.barChart(
            DATA.growth.map(function (d) { return { label: String(d.year), value: d.g }; }),
            function (v) { return v.toFixed(1) + "%"; });
        } else {
          box.innerHTML = CHART.donutChart(DATA.sectors);
        }
      });
    });
  }

  function render() {
    var path = currentRoute();
    view.innerHTML = routes[path].render();
    document.title = routes[path].title;
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-route") === path);
      if (a.getAttribute("data-route") === path) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    bindControls();
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", render);
  render();
})();
