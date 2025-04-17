document.addEventListener("DOMContentLoaded", function () {
  const csvFile = "https://www.dropbox.com/scl/fi/xd0f1l4fa8iwlahkgkikd/equity_gap.csv?rlkey=b57u4j0b2u6u3jwfcjxgeht29&st=kt29gal0&dl=0";

  d3.csv(csvFile, d3.autoType).then(data => {
    console.log("Sample record:", data[0]);
    
    // Parse numeric values
    data.forEach(d => {
      d.Weekly_Earnings = +d.Weekly_Earnings;
      d.Sex = d.Sex?.trim();
      if (d.Sex === "male") d.Sex = "Male";
      if (d.Sex === "female") d.Sex = "Female";
    });

    const years = Array.from(new Set(data.map(d => d.year))).sort();

    // Dropdown menu
    const yearSelect = d3.select("#controls")
      .append("label")
      .text("Select Year: ")
      .append("select")
      .attr("id", "year-select")
      .style("background-color", "#ffffff")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("padding", "12px 20px")
      .style("font-size", "18px")
      .style("margin-bottom", "30px")
      .style("cursor", "pointer")
      .style("box-shadow", "0 1px 3px rgba(0, 0, 0, 0.1)");

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
      const selectedYear = +yearSelect.property("value");
      const filteredData = data.filter(d => d.year === selectedYear);

      // Group by occupation and sex
      const grouped = d3.groups(filteredData, d => d.Occupation, d => d.Sex);
      console.log("Grouped data:", grouped);

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

      equityData.forEach(d => {
        if (d.male == null || d.female == null) {
          console.warn(`Missing data for ${d.occupation}`, d);
        }
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

      rows.append("td").text(d => d.occupation.replace(" occupations", ""));
      rows.append("td").text(d => d.male != null ? `$${d.male.toFixed(2)}` : "N/A");
      rows.append("td").text(d => d.female != null ? `$${d.female.toFixed(2)}` : "N/A");
      rows.append("td").text(d => d.equityRatio != null ? d.equityRatio.toFixed(2) : "N/A")
        .style("color", d => {
          if (d.equityRatio == null) return "gray";
          return Math.abs(1 - d.equityRatio) < 0.1 ? "green" : "red";
        });

      // === Build the Gap Bar Chart ===
      const margin = { top: 60, right: 40, bottom: 180, left: 80 };
      const width = 760 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3.select("#bar-chart-container").html("")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const topGaps = equityData
        .filter(d => d.gap != null)
        .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
        .slice(0, 15);

      // X Scale (occupations)
      const x = d3.scaleBand()
        .domain(topGaps.map(d => d.occupation.replace(" occupations", "")))
        .range([0, width])
        .padding(0.2);

      // Y Scale (gap)
      const y = d3.scaleLinear()
        .domain([0, d3.max(topGaps, d => d.gap || 0)])
        .nice()
        .range([height, 0]);

      // Bars
      svg.selectAll(".gap-bar")
        .data(topGaps)
        .enter()
        .append("rect")
        .attr("class", "gap-bar")
        .attr("x", d => x(d.occupation.replace(" occupations", "")))
        .attr("width", x.bandwidth())
        .attr("y", d => y(Math.max(0, d.gap || 0)))
        .attr("height", d => Math.abs(y(d.gap || 0) - y(0)))
        .attr("fill", d => d.gap > 0 ? "steelblue" : "orange")
        .append("title")
        .text(d => `${d.occupation.replace(" occupations", "")} Gap: $${d.gap?.toFixed(2) || "N/A"}`);

      // X Axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .style("fill", "#444");

      // Y Axis
      svg.append("g")
        .call(d3.axisLeft(y).tickFormat(d => `$${d}`))
        .selectAll("text")
        .style("font-size", "14px")
        .style("fill", "#333");

      // Title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text(`Pay Gap by Occupation (${selectedYear}) — Male Minus Female Earnings`);

      const legendGroup = svg.append("g")
        .attr("transform", `translate(${width / 2 - 100}, 10)`);

      legendGroup.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 6).style("fill", "steelblue");
      legendGroup.append("text").attr("x", 10).attr("y", 4).text("Male earns more").style("font-size", "12px");

      legendGroup.append("circle").attr("cx", 140).attr("cy", 0).attr("r", 6).style("fill", "orange");
      legendGroup.append("text").attr("x", 150).attr("y", 4).text("Female earns more").style("font-size", "12px");

    }
  });
});