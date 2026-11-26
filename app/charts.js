// Charts for NusaData. Every chart is plain SVG built from data, no library:
// bars, lines, a donut and an age pyramid. Each function returns an SVG
// string; the pages drop it into the document.
var CHART = (function () {
  var INK = "#123b4f";
  var TEAL = "#0e7c7b";
  var AMBER = "#f2a541";
  var SAND = "#e8e2d4";
  var GRID = "#d8d2c2";
  var MUTED = "#5f6b70";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  function niceMax(values) {
    var m = Math.max.apply(null, values);
    var step = Math.pow(10, Math.floor(Math.log10(m)));
    return Math.ceil(m / step) * step;
  }

  // Vertical bar chart. rows: [{label, value}], valueLabel formats a value.
  function barChart(rows, valueLabel, height) {
    height = height || 260;
    var W = 640, H = height, padL = 44, padB = 34, padT = 12;
    var max = niceMax(rows.map(function (r) { return r.value; }));
    var slot = (W - padL - 16) / rows.length;
    var barW = Math.min(46, slot * 0.62);
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Bar chart">';
    for (var g = 0; g <= 4; g++) {
      var y = padT + (H - padB - padT) * (1 - g / 4);
      var gv = max * g / 4;
      out += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - 8) + '" y2="' + y + '" stroke="' + GRID + '"/>';
      out += '<text x="' + (padL - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + valueLabel(gv) + '</text>';
    }
    rows.forEach(function (r, i) {
      var x = padL + slot * i + (slot - barW) / 2;
      var bh = (H - padB - padT) * (r.value / max);
      var y = H - padB - bh;
      var fill = r.value < 0 ? "#c05a3c" : (i % 2 ? TEAL : INK);
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + Math.max(bh, 1).toFixed(1) + '" rx="3" fill="' + fill + '"/>';
      out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + INK + '">' + valueLabel(r.value) + '</text>';
      out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(r.label) + '</text>';
    });
    return out + '</svg>';
  }

  // Line chart with dots. rows: [{label, value}].
  function lineChart(rows, valueLabel, height) {
    height = height || 260;
    var W = 640, H = height, padL = 44, padB = 34, padT = 16;
    var vals = rows.map(function (r) { return r.value; });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
    if (lo === hi) { lo -= 1; hi += 1; }
    var pad = (hi - lo) * 0.15; lo -= pad; hi += pad;
    function X(i) { return padL + (W - padL - 20) * i / (rows.length - 1); }
    function Y(v) { return padT + (H - padB - padT) * (1 - (v - lo) / (hi - lo)); }
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Line chart">';
    for (var g = 0; g <= 4; g++) {
      var y = padT + (H - padB - padT) * (1 - g / 4);
      out += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - 8) + '" y2="' + y + '" stroke="' + GRID + '"/>';
      out += '<text x="' + (padL - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + valueLabel(lo + (hi - lo) * g / 4) + '</text>';
    }
    var pts = rows.map(function (r, i) { return X(i).toFixed(1) + ',' + Y(r.value).toFixed(1); }).join(' ');
    out += '<polyline points="' + pts + '" fill="none" stroke="' + TEAL + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
    rows.forEach(function (r, i) {
      out += '<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(r.value).toFixed(1) + '" r="5" fill="#fff" stroke="' + TEAL + '" stroke-width="3"/>';
      out += '<text x="' + X(i).toFixed(1) + '" y="' + (Y(r.value) - 11).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="700" fill="' + INK + '">' + valueLabel(r.value) + '</text>';
      out += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(r.label) + '</text>';
    });
    return out + '</svg>';
  }

  // Donut chart with a legend. rows: [{label, value}] (or {label, share})
  // where values sum to ~100.
  function donutChart(rows) {
    var W = 640, H = 280, cx = 140, cy = 140, R = 104, r = 58;
    var palette = [INK, TEAL, AMBER, "#7fb3a8", "#c05a3c", "#8a7f6a", "#4d9de0", "#e07a5f", "#b8b09a"];
    function val(row) { return row.value !== undefined ? row.value : row.share; }
    function lab(row) { return row.label !== undefined ? row.label : row.name; }
    var total = rows.reduce(function (s, x) { return s + val(x); }, 0);
    var a0 = -Math.PI / 2;
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Donut chart">';
    rows.forEach(function (row, i) {
      var frac = val(row) / total;
      var a1 = a0 + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
      var x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
      var x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
      var x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
      out += '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + R + ' ' + R + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) +
        ' L ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + x3.toFixed(1) + ' ' + y3.toFixed(1) + ' Z" fill="' + palette[i % palette.length] + '"/>';
      a0 = a1;
    });
    out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="800" fill="' + INK + '">100%</text>';
    out += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="' + MUTED + '">of GDP, 2024</text>';
    rows.forEach(function (row, i) {
      var ly = 26 + i * 26;
      out += '<rect x="300" y="' + (ly - 11) + '" width="14" height="14" rx="3" fill="' + palette[i % palette.length] + '"/>';
      out += '<text x="322" y="' + ly + '" font-size="13" fill="' + INK + '">' + esc(lab(row)) + ' — ' + val(row).toFixed(1) + '%</text>';
    });
    return out + '</svg>';
  }

  // Age pyramid: horizontal bars from a centre line, one bar per age band.
  function pyramidChart(rows) {
    var W = 640, H = 460, mid = 320, top = 8, rowH = (H - top - 24) / rows.length;
    var max = Math.max.apply(null, rows.map(function (r) { return r.share; }));
    var scale = 250 / max;
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Age pyramid">';
    out += '<text x="60" y="18" font-size="12" font-weight="700" fill="' + MUTED + '">Share of population, %</text>';
    rows.forEach(function (r, i) {
      var y = top + 14 + i * rowH;
      var w = r.share * scale;
      out += '<rect x="' + (mid - w).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + (rowH - 5).toFixed(1) + '" rx="2" fill="' + TEAL + '"/>';
      out += '<text x="' + (mid - w - 6).toFixed(1) + '" y="' + (y + rowH / 2 - 1).toFixed(1) + '" text-anchor="end" font-size="11" font-weight="700" fill="' + INK + '">' + r.share.toFixed(1) + '%</text>';
      out += '<text x="' + (mid + 8) + '" y="' + (y + rowH / 2 - 1).toFixed(1) + '" font-size="12" fill="' + INK + '">' + esc(r.band) + ' years</text>';
    });
    out += '<line x1="' + mid + '" y1="' + (top + 8) + '" x2="' + mid + '" y2="' + (H - 18) + '" stroke="' + GRID + '"/>';
    return out + '</svg>';
  }

  return { barChart: barChart, lineChart: lineChart, donutChart: donutChart, pyramidChart: pyramidChart };
})();
