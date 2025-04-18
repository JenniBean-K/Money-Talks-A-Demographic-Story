async function fetchCSVData() {
  const response = await fetch('outputs/wage_gap_by_occupation.csv');
  const text = await response.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true
  });

  const data = {};
  parsed.data.forEach(row => {
    const occupation = row["Occupation"];
    const female = parseFloat(row["Female"]);
    const male = parseFloat(row["Male"]);
    if (!isNaN(female) && !isNaN(male)) {
      data[occupation] = { female, male };
    }
  });

  return data;
}

function populateDropdown(data) {
  const select = document.getElementById('occupation-select');
  select.innerHTML = ''; // Clear existing options

  const sortedOccupations = Object.entries(data)
    .map(([occupation, values]) => ({
      occupation,
      gap: Math.abs(values.male - values.female)
    }))
    .sort((a, b) => b.gap - a.gap); // Most gap at top

  sortedOccupations.forEach(({ occupation }) => {
    const option = document.createElement('option');
    option.value = occupation;
    option.textContent = occupation;
    select.appendChild(option);
  });
}

function updateChart(occupation, data) {
  const { female, male } = data[occupation];
  const maxEarnings = 2200;
  const gap = Math.abs(male - female);
  const roundedGap = gap.toFixed(2);

  document.getElementById("female-bar").style.height = `${(female / maxEarnings) * 100}%`;
  document.getElementById("male-bar").style.height = `${(male / maxEarnings) * 100}%`;
  document.getElementById("gap-value").innerText = `$${roundedGap}`;

  const gapBox = document.querySelector('.gap-box');
  if (gap === 0) {
    gapBox.style.backgroundColor = '#B4E197'; // green
  } else if (gap < 125) {
    gapBox.style.backgroundColor = '#FDF3B1'; // yellow
  } else {
    gapBox.style.backgroundColor = '#F3BCBC'; // red
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchCSVData();
  populateDropdown(data);
  const select = document.getElementById('occupation-select');
  select.addEventListener("change", () => updateChart(select.value, data));
  updateChart(select.value, data); // Initial chart
});
