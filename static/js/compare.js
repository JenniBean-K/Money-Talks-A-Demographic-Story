function submitForm() {
  const selects = document.querySelectorAll('select#occupation');
  const occupation = selects.length > 1 ? selects[1].value : selects[0].value;
  const wage = parseFloat(document.getElementById('wage').value);

  fetch('static/json/compare_wage.json')
    .then(response => response.json())
    .then(data => {
      const match = data.find(item => item.occupation.trim().toLowerCase() === occupation.trim().toLowerCase());
      if (!match) {
        alert("Occupation data not found.");
        return;
      }

      // Chart.js canvas block removed
      // const ctx = document.getElementById('chart').getContext('2d');
      // if (window.myChart) { window.myChart.destroy(); }
      // window.myChart = new Chart(ctx, { ... });

      const trace = {
        x: ['You', 'Male Avg', 'Female Avg', 'Overall Avg'],
        y: [wage, match.male_avg, match.female_avg, match.overall_avg],
        type: 'bar',
        marker: {
          color: ['red', 'green', 'yellow', 'blue']
        }
      };
      const layout = {
        title: {
          text: 'Weekly Earnings Comparison',
          font: {
            family: 'Merriweather, serif',
            size: 22,
            color: '#333'
          },
          xref: 'paper',
          x: 0
        },
        plot_bgcolor: '#fff',
        paper_bgcolor: '#fff',
        yaxis: {
          title: 'Earnings ($)',
          titlefont: {
            family: 'Merriweather, serif',
            size: 16,
            color: '#333'
          },
          tickfont: {
            family: 'Merriweather, serif',
            size: 14,
            color: '#333'
          },
          gridcolor: '#e5e5e5'
        },
        xaxis: {
          tickfont: {
            family: 'Merriweather, serif',
            size: 14,
            color: '#333'
          }
        },
        margin: { t: 50, l: 50, r: 30, b: 50 }
      };
      Plotly.newPlot('compare-chart', [trace], layout, { displayModeBar: false });
      
      // Update custom bars and wage gap
      document.getElementById('female-bar').style.height = `${match.female_avg / 10}px`;
      document.getElementById('male-bar').style.height = `${match.male_avg / 10}px`;
      
      const gap = Math.abs(match.male_avg - match.female_avg).toFixed(2);
      const gapValue = document.getElementById('gap-value');
      gapValue.textContent = `$${gap}`;
      
      // Color the gap box based on size
      const gapBox = document.querySelector('.gap-box');
      if (gap == 0) {
        gapBox.style.borderColor = '#B4E197';
        gapBox.style.backgroundColor = '#B4E197';
      } else if (gap < 125) {
        gapBox.style.borderColor = '#FDF3B1';
        gapBox.style.backgroundColor = '#FDF3B1';
      } else {
        gapBox.style.borderColor = '#F3BCBC';
        gapBox.style.backgroundColor = '#F3BCBC';
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const selects = [
    ...document.querySelectorAll('select#occupation'),
    ...document.querySelectorAll('select#occupation-select')
  ];
  fetch('static/json/compare_wage.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(item => {
        selects.forEach(select => {
          if (!select) return;
          const option = document.createElement('option');
          option.value = item.occupation;
          option.textContent = item.occupation;
          select.appendChild(option);
        });
      });
    });
});
