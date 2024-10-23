// NYC Open Data DSNY Disposal Facilities Used by Year
fetch("https://data.cityofnewyork.us/resource/6r9j-qrwz.json?$query=SELECT%20calendar_year%2C%20facility_name%2C%20facility_total_loads%2C%20facility_actual_tons_delivered")
    .then(response => response.json())
    .then(data => {
        // 2 datasets
        const data1 = data.map(d => ({
            group: d.facility_name,
            value: +d.facility_total_loads || 0
        }));

        const data2 = data.map(d => ({
            group: d.facility_name,
            value: +d.facility_actual_tons_delivered || 0
        }));

        // Initialize the plot with the first dataset
        update(data1);

        // ???store dataset globally to use with button
        window.data1 = data1;
        window.data2 = data2;
    })


    .catch(error => console.error('Error fetching data:', error));

// Set the dimensions and margins of the graph
const margin = {top: 30, right: 30, bottom: 140, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Append the svg object to the div
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//X axis
const x = d3.scaleBand()
  .range([0, width])
  .padding(0.2);

// Add Y axis
const y = d3.scaleLinear()
  .range([height, 0]);
svg.append("g")
  .attr("class", "myYaxis");

// update the plot????
function update(data) {
   
    x.domain(data.map(d => d.group));
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");


    y.domain([0, d3.max(data, d => d.value)]);
    svg.selectAll(".myYaxis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

    // Bind data to the bars
    const bars = svg.selectAll("rect")
      .data(data);

    bars.join("rect")
      .transition()
      .duration(1000)
      .attr("x", d => x(d.group))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#69b3a2");
}


