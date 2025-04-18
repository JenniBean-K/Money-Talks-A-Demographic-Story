fetch('static/json/education_enrollment_wage.json')
  .then(res => res.json())
  .then(data => {
    const femaleData = [];
    const maleData = [];

    const keys = Object.keys(data.Sex);

    for (let i = 0; i < keys.length; i++) {
      const level = data.Education_Level_Attained[i];
      const wage = data.Mean[i];
      const sex = data.Sex[i];

      if (sex === 'Female') {
        femaleData.push({ x: level, y: wage });
      } else if (sex === 'Male') {
        maleData.push({ x: level, y: wage });
      }
    }

    const educationLevels = [...new Set([...femaleData, ...maleData].map(d => d.x))];
    const customOrder = [
      "Less than 1st grade",
      "1st-4th grade",
      "5th-6th grade",
      "7th-8th grade",
      "9th grade",
      "10th grade",
      "11th grade",
      "12th grade, no diploma",
      "High school graduate",
      "Some college, no degree",
      "Associate degree - occupational",
      "Associate degree - academic",
      "Bachelor's degree",
      "Master's degree",
      "Doctorate degree",
      "Professional degree"
    ];
    educationLevels.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b));

    // Create dumbbell chart container
    const dumbbellDiv = document.createElement('div');
    dumbbellDiv.id = 'education-dumbbell';
    dumbbellDiv.style = 'width:100%;max-width:900px;height:500px;margin:40px auto;';
    document.querySelector('#education-heading + p + blockquote').insertAdjacentElement('afterend', dumbbellDiv);

    const maleY = educationLevels;
    const femaleX = educationLevels.map(level => {
      const match = femaleData.find(d => d.x === level);
      return match ? match.y : null;
    });
    const maleX = educationLevels.map(level => {
      const match = maleData.find(d => d.x === level);
      return match ? match.y : null;
    });

    const dumbbellLines = educationLevels.map((level, i) => ({
      type: 'line',
      x0: femaleX[i],
      x1: maleX[i],
      y0: level,
      y1: level,
      line: {
        color: '#ccc',
        width: 2
      },
      layer: 'below'
    }));

    const femaleTraceDumbbell = {
      x: femaleX,
      y: maleY,
      mode: 'markers',
      name: 'Female',
      marker: {
        color: '#d62728',
        size: 10
      },
      orientation: 'h',
      type: 'scatter'
    };

    const maleTraceDumbbell = {
      x: maleX,
      y: maleY,
      mode: 'markers',
      name: 'Male',
      marker: {
        color: '#1f77b4',
        size: 10
      },
      orientation: 'h',
      type: 'scatter'
    };

    const dumbbellLayout = {
      title: '',
      xaxis: {
        title: 'Mean Weekly Earnings ($)',
        tickfont: { family: 'Merriweather, serif', size: 12 }
      },
      yaxis: {
        tickfont: { family: 'Merriweather, serif', size: 12 }
      },
      legend: {
        orientation: 'h',
        y: 1,
        yanchor: 'bottom',
        x: 0.5,
        xanchor: 'center',
        font: {
          family: 'Merriweather, serif',
          size: 12
        }
      },
      margin: { t: 0, b: 40, l: 200, r: 0 },
      shapes: dumbbellLines
    };

    Plotly.newPlot('education-dumbbell', [femaleTraceDumbbell, maleTraceDumbbell], dumbbellLayout, { displayModeBar: false });
  })
  .catch(error => {
    console.error('Error loading or parsing education chart JSON:', error);
  });