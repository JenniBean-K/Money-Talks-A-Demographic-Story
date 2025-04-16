// document.addEventListener("DOMContentLoaded", function () {
//   const csvFile = "wage_gap_by_occupation.csv"; // Path to your CSV file

//   d3.csv(csvFile, d3.autoType).then(data => {
//     // Parse numeric fields
//     data.forEach(d => {
//       d.Weekly_Earnings = +d.Weekly_Earnings;
//     });

//     const years = Array.from(new Set(data.map(d => d.year))).sort();

//     const yearSelect = d3.select("#controls")
//       .append("label")
//       .text("Select Year: ")
//       .append("select")
//       .attr("id", "year-select");

//     yearSelect.selectAll("option")
//       .data(years)
//       .enter()
//       .append("option")
//       .text(d => d)
//       .attr("value", d => d);

//     yearSelect.on("change", updateTableAndGraph);

//     // Initial display
//     updateTableAndGraph();

//     function updateTableAndGraph() {
//       const selectedYear = +yearSelect.property("value") || years[0];
//       const filteredData = data.filter(d => d.year === selectedYear);

//       // Group by occupation and sex
//       const grouped = d3.groups(filteredData, d => d.Occupation, d => d.Sex);

//       // Aggregate average weekly earnings per occupation/sex
//       const equityData = grouped.map(([occupation, sexGroup]) => {
//         const earnings = {};
//         sexGroup.forEach(([sex, records]) => {
//           const avg = d3.mean(records, d => d.Weekly_Earnings);
//           earnings[sex] = avg;
//         });

//         return {
//           occupation,
//           male: earnings.Male ?? null,
//           female: earnings.Female ?? null,
//           equityRatio: earnings.Female && earnings.Male ? earnings.Female / earnings.Male : null
//         };
//       });

//       // Sort by how close the ratio is to 1
//       equityData.sort((a, b) => {
//         const aDiff = Math.abs(1 - (a.equityRatio ?? 0));
//         const bDiff = Math.abs(1 - (b.equityRatio ?? 0));
//         return aDiff - bDiff;
//       });

//       // Build table
//       const table = d3.select("#table-container").html("")
//         .append("table")
//         .attr("class", "equity-table");

//       const thead = table.append("thead").append("tr");
//       thead.selectAll("th")
//         .data(["Occupation", "Avg Male Earnings", "Avg Female Earnings", "Equity Ratio"])
//         .enter()
//         .append("th")
//         .text(d => d);

//       const tbody = table.append("tbody");

//       const rows = tbody.selectAll("tr")
//         .data(equityData)
//         .enter()
//         .append("tr");

//       rows.append("td").text(d => d.occupation);
//       rows.append("td").text(d => d.male != null ? `$${d.male.toFixed(2)}` : "N/A");
//       rows.append("td").text(d => d.female != null ? `$${d.female.toFixed(2)}` : "N/A");
//       rows.append("td").text(d => d.equityRatio != null ? d.equityRatio.toFixed(2) : "N/A")
//         .style("color", d => {
//           if (d.equityRatio == null) return "gray";
//           return Math.abs(1 - d.equityRatio) < 0.1 ? "green" : "red";
//         });

//       // Create the bar chart visualization
//       const margin = { top: 30, right: 20, bottom: 60, left: 50 };
//       const width = 800 - margin.left - margin.right;
//       const height = 400 - margin.top - margin.bottom;

//       const svg = d3.select("#bar-chart-container").html("")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       const x = d3.scaleBand()
//         .domain(equityData.map(d => d.occupation))
//         .range([0, width])
//         .padding(0.1);

//       const yMale = d3.scaleLinear()
//         .domain([0, d3.max(equityData, d => d.male || 0)])
//         .nice()
//         .range([height, 0]);

//       const yFemale = d3.scaleLinear()
//         .domain([0, d3.max(equityData, d => d.female || 0)])
//         .nice()
//         .range([height, 0]);

//       svg.append("g")
//         .selectAll(".bar.male")
//         .data(equityData)
//         .enter()
//         .append("rect")
//         .attr("class", "bar male")
//         .attr("x", d => x(d.occupation))
//         .attr("y", d => yMale(d.male || 0))
//         .attr("width", x.bandwidth() / 2)
//         .attr("height", d => height - yMale(d.male || 0))
//         .attr("fill", "steelblue");

//       svg.append("g")
//         .selectAll(".bar.female")
//         .data(equityData)
//         .enter()
//         .append("rect")
//         .attr("class", "bar female")
//         .attr("x", d => x(d.occupation) + x.bandwidth() / 2)
//         .attr("y", d => yFemale(d.female || 0))
//         .attr("width", x.bandwidth() / 2)
//         .attr("height", d => height - yFemale(d.female || 0))
//         .attr("fill", "orange");

//       svg.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .style("text-anchor", "middle")
//         .attr("transform", "rotate(-45)")
//         .style("font-size", "12px");

//       svg.append("g")
//         .attr("class", "y-axis-male")
//         .call(d3.axisLeft(yMale));

//       svg.append("g")
//         .attr("class", "y-axis-female")
//         .attr("transform", "translate(" + width + ", 0)")
//         .call(d3.axisRight(yFemale));

//     }
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  const csvFile = "wage_gap_by_occupation.csv";

  d3.csv(csvFile, d3.autoType).then(data => {
    // Parse numeric values
    data.forEach(d => {
      d.Weekly_Earnings = +d.Weekly_Earnings;
    });

    const years = Array.from(new Set(data.map(d => d.year))).sort();

    // Dropdown menu
    const yearSelect = d3.select("#controls")
      .append("label")
      .text("Select Year: ")
      .append("select")
      .attr("id", "year-select");

    yearSelect.selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);

    yearSelect.on("change", updateTableAndGraph);

    // Initial display
    updateTableAndGraph();

    function updateTableAndGraph() {
      const selectedYear = +yearSelect.property("value") || years[0];
      const filteredData = data.filter(d => d.year === selectedYear);

      // Group by occupation and sex
      const grouped = d3.groups(filteredData, d => d.Occupation, d => d.Sex);

      // Compute equity data per occupation
      const equityData = grouped.map(([occupation, sexGroup]) => {
        const earnings = {};
        sexGroup.forEach(([sex, records]) => {
          const avg = d3.mean(records, d => d.Weekly_Earnings);
          earnings[sex] = avg;
        });
        return {
          occupation,
          male: earnings.Male ?? null,
          female: earnings.Female ?? null,
          equityRatio: earnings.Female && earnings.Male ? earnings.Female / earnings.Male : null,
          gap: earnings.Male && earnings.Female ? earnings.Male - earnings.Female : null
        };
      });

      // Sort by smallest gap (closest to 0)
      equityData.sort((a, b) => Math.abs(a.gap || 0) - Math.abs(b.gap || 0));

      // === Build the table ===
      const table = d3.select("#table-container").html("")
        .append("table")
        .attr("class", "equity-table");

      const thead = table.append("thead").append("tr");
      thead.selectAll("th")
        .data(["Occupation", "Avg Male Earnings", "Avg Female Earnings", "Equity Ratio"])
        .enter()
        .append("th")
        .text(d => d);

      const tbody = table.append("tbody");
      const rows = tbody.selectAll("tr")
        .data(equityData)
        .enter()
        .append("tr");

      rows.append("td").text(d => d.occupation);
      rows.append("td").text(d => d.male != null ? `$${d.male.toFixed(2)}` : "N/A");
      rows.append("td").text(d => d.female != null ? `$${d.female.toFixed(2)}` : "N/A");
      rows.append("td").text(d => d.equityRatio != null ? d.equityRatio.toFixed(2) : "N/A")
        .style("color", d => {
          if (d.equityRatio == null) return "gray";
          return Math.abs(1 - d.equityRatio) < 0.1 ? "green" : "red";
        });

      // === Build the Gap Bar Chart ===
      const margin = { top: 40, right: 20, bottom: 100, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select("#bar-chart-container").html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X Scale (occupations)
      const x = d3.scaleBand()
        .domain(equityData.map(d => d.occupation))
        .range([0, width])
        .padding(0.2);

      // Y Scale (gap)
      const y = d3.scaleLinear()
        .domain(d3.extent(equityData, d => d.gap || 0))
        .nice()
        .range([height, 0]);

      // Bars
      svg.selectAll(".gap-bar")
        .data(equityData)
        .enter()
        .append("rect")
        .attr("class", "gap-bar")
        .attr("x", d => x(d.occupation))
        .attr("width", x.bandwidth())
        .attr("y", d => y(Math.max(0, d.gap || 0)))
        .attr("height", d => Math.abs(y(d.gap || 0) - y(0)))
        .attr("fill", d => d.gap > 0 ? "steelblue" : "orange")
        .append("title")
        .text(d => `Gap: $${d.gap?.toFixed(2) || "N/A"}`);

      // X Axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px");

      // Y Axis
      svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => `$${d}`));

      // Title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(`Pay Gap by Occupation (${selectedYear}) — Male Minus Female Earnings`);

      // Legend
      svg.append("circle").attr("cx", 10).attr("cy", -30).attr("r", 6).style("fill", "steelblue");
      svg.append("text").attr("x", 20).attr("y", -26).text("Male earns more").style("font-size", "12px");

      svg.append("circle").attr("cx", 150).attr("cy", -30).attr("r", 6).style("fill", "orange");
      svg.append("text").attr("x", 160).attr("y", -26).text("Female earns more").style("font-size", "12px");
    }
  });
});











