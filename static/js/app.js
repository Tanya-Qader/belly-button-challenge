//Use the D3 library: URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json

//setting up the URL for the data

const url ="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


//obtaining JSON data from URL

d3.json(url).then((data) => {
    console.log(data);
});


// Step 1:

function DropDown() {

    // use D3 to select a DROPDOWN MENU
    let dropdownmenu = d3.select("#selDataset");
    
    d3.json(url).then((data) => {

        let data_ids= data.names;
    
        data_ids.forEach((id) => {
            console.log(id);

            dropdownmenu.append("option").text(id).property("value", id);
        
     });

    let sample = names[0];

        console.log(sample);

        // Build the initial plots
        metaData(sample);
        barChart(sample);
        bubbleChart(sample);
        gaugeChart(sample);

    });
};

// Step 2: Bar Chart
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

function barChart(sample) {
    d3.json(url).then((data) => {
        
        let Data_samples = data.samples;
        let value = Data_samples.filter(result => result.id == sample);
       
        // first index value 
        let Data_value = value[0]

        let sample_values = Data_value.sample_values;

        let otu_ids = Data_value.otu_ids;

        let otu_labels = Data_value.otu_labels;

        console.log(sample_values, otu_ids, otu_labels);

        let x_value = sample_values.slice(0,10).reverse();
        let y_value = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        let barTrace = {
            x: x_value,
            y: y_value,
            type: "bar",
            orientation: "h",
            marker: {color: "#4573ba"},
            text: labels,
        };

        let layout = {
            width: 500,
            height: 500,
            autosize: false,
            margin: {l: 100, r: 100, b: 50, t: 100, pad: 15},
        };

        Plotly.newPlot("bar", [barTrace], layout);

    });
};

 
 //Set up the trace for the Bubble chart

    // Build the bubble chart
    function bubbleChart(sample) {

        d3.json(url).then((data) => {
            
            let Data_samples = data.samples;
            let value = Data_samples.filter(result => result.id == sample);
    
            //first index value from array
            let Data_value = value[0];

            let sample_values = Data_value.sample_values;
            let otu_ids = Data_value.otu_ids;
            let otu_labels = Data_value.otu_labels;
            console.log(otu_ids,otu_labels,sample_values);
      
            let bubbleTrace = {
                x: otu_ids,
                y: sample_values,
                mode: "markers",
                text: otu_labels,
                marker: {
                  color: otu_ids,
                  size: sample_values,
                  colorscale: "Earth"
                }
              };
              
              let layout = {
                showlegend: false,
                height: 600,
                width: 1200,
                title: "Bacteria Present Operational Taxonomic Unit",
                xaxis: {title: "OTU ID"},
                hovermode: "closest",
              };
              
              Plotly.newPlot("bubble", [bubbleTrace], layout);
    
        });
    };


// 3. Create a bubble chart that displays each sample.
// https://plotly.com/javascript/gauge-charts/

    function gaugeChart(sample) {

        d3.json(url).then((data) => {
            
            let metadata = data.metadata;
            let value = metadata.filter(result => result.id == sample);
            console.log(value)

            //first index value from array
            let Data_value = value[0];
    
            let wFreq = Object.values(Data_value)[6];

//Set up the trace for the gauge chart
        let gaugeTrace = {
            type: "indicator",
            mode: "gauge+number",
            value: wFreq,
            domain: {x: [0.1], y: [0,1]},
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 18 } },
            gauge: {
            axis: { range: [0,10], tickwidth: 1, tickcolor: "black", tickmode: "linear", tick0: 2, dtick: 2},
            bar: { color: "#f5c1ef" },
            bgcolor: "white",
            steps: [
                {range: [0, 1], color: "#C0D4C2"},
                {range: [1, 2], color: "#EDEEDE"},
                {range: [2, 3], color: "#C0D4C2"},
                {range: [3, 4], color: "#EDEEDE"},
                {range: [4, 5], color: "#C0D4C2"},
                {range: [5, 6], color: "#EDEEDE"},
                {range: [6, 7], color: "#C0D4C2"},
                {range: [7, 8], color: "#EDEEDE"},
                {range: [8, 9], color: "#C0D4C2"} 
                ],
            }
        };

        //setting up the layout

        let layout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white"

        };

        Plotly.newPlot("gauge", [gaugeTrace], layout);

    });
};

//4. Display Sample metadata
//5. Display each key-value pair from the metadata JSON object somewhere on the page.


function metaData(old_sample) {

    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == old_sample);

        console.log(value);

        let Data_value = value[0];
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(Data_value).forEach(([key,value]) => {

            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Update all the plots when a new sample is selected. 
// Additionally, you are welcome to create any layout that you would like for your dashboard. An example dashboard is shown as follows:
d3.selectAll("#selDataset").on("change", sample_Changed);

// Functin for changes
function sample_Changed() { 
    let dropdownmenu = d3.select("#selDataset");

    let new_sample = dropdownmenu.property("value");

    // Log the new value
    console.log(new_sample); 

    // update the charts
    metaData(new_sample);
    barChart(new_sample);
    bubbleChart(new_sample);
    gaugeChart(new_sample);
};

function optionChanged(nextID) {
    console.log("newID:", nextID)

};


 DropDown();






    


   


