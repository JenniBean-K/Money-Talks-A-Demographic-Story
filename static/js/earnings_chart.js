fetch('static/json/earnings_chart.json')
  .then(res => res.json())
  .then(data => {
    Plotly.newPlot('chartDiv', data.data, data.layout, { displayModeBar: false });
  });