
// Retrieve and declare the main dataset
d3.csv('spotify_top_2021.csv', function(d) {
    
    return {
        rank: +d.rank,
        title: d.title,
        artist: d.artist,
        genre: d.genre,
        year: +d.year,
        bpm: +d.bpm,
        energy: (+d.nrgy)/100,
        danceability: (+d.dnce)/100,
        decibel: +d.db,
        valence: (+d.val)/100,
        duration: +d.dur,
        acousticness: (+d.acous)/100,
        popularity: (+d.pop)/100
    };

}, function(d) {

    color_graph(d)
    radar_chart(d)

    // Retrieve and declare the correlation matrix
    d3.csv('spotify_cor.csv', function(c) {

        return {
          bpm: +c.bpm,
          energy: +c.nrgy,
          danceability: +c.dnce,
          decibel: +c.db,
          valence: +c.val,
          duration: +c.dur,
          acousticness: +c.acous,
          popularity: +c.pop
        };
    
      }, function(c) {

        scatter_plot(d,c)
      });
});


// Declaration of the height, width, etc...
let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Declaration of the features (for the radarchart and scaterplot)
let features = ['energy','danceability','valence','acousticness','popularity'];

/* ----- COLORS ------
 
  Manages the color given to each song according to its rank.
  A diagram showing the color given to each song.
  Uses js-colormaps (github.com/timothygebhard/js-colormaps) */

function manage_colors(d) {
    // Decleration of a list for the colors
    let colors = [];

    // Populates the list with the color and puts the in rgb() format
    for (let i = 0 ; i < d.length + 1; i++) {
        // gets color from a colormap
        let rgb_color = plasma(i/d.length); // returns a list

        // transforms the list to a rgb() format
        let color = `rgb(${rgb_color[0]},${rgb_color[1]},${rgb_color[2]})`;
        colors.push(color);
      }
      
    // Creates a domain with the ranks
    let domain = d3.range(1,d.length+1,1);
    let colorScale = d3.scaleOrdinal()
        .domain(domain)
        .range(colors);
    
    return {domain, colors, colorScale}
    }

function color_graph(d) {
    
    // Creates the color diagram
    let svg_color = d3.select('#rank_color').append('svg')
        .attr('width', 800)
        .attr('height', 200);

    // Retrieves the domain and colorScale
    let domain = manage_colors(d).domain;
    let colorScale = manage_colors(d).colorScale;
    
    // Declaration of the x axis
    let x_scale = d3.scaleBand()
        .domain(domain)
        .range([20,680]);

    // Creates an x axis with only multiple of 10 shown
    let x_axis = d3.axisBottom(x_scale)
        .tickValues(x_scale.domain().filter(function(i){ return !(i%5)}));
    
    // Adds the axis to the diagram
    svg_color.append('g')
        .attr('transform', 'translate(0,70)')
        .call(x_axis);
    
    // Declaration of the tooltip
    let tooltip = d3.select('#rank_color')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', '#ffffff')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '3px')
        .style('padding', '3px');

    // Adds each color to the graph
    svg_color.selectAll('rect')
        .data(domain)
        .enter()
        .append('rect')
        .attr('x', (c) => x_scale(c))
        .attr('y', 40)
        .attr('width', 10)
        .attr('height', 30)
        .attr('fill', (c) => colorScale(c))
        .style('opacity', 0.8)
        .on('mouseover', function(){
            // Changes style/shows the tooltip when the mouse hovers a point
            tooltip.style('opacity', 1);
            d3.select(this).style('stroke', 'black').style('opacity', 1);
            })
        .on('mousemove', function(c){
            // Shows the title and author when the mouse hovers a point
            tooltip.html(`${c} - ${d[c-1].title} - ${d[c-1].artist}`)
                .style('left', d3.event.pageX + 10 + 'px')
                .style('top', d3.event.pageY - 20 + 'px');
            })
        .on('mouseleave', function(){
            // Hides the tooltip and puts initial style to the point
            tooltip.style('opacity', 0);
            d3.select(this).style('stroke', 'none').style('opacity',0.8);
            })
        .on('click', function(c){
            // Add the song to the radarchart
            radar_chart(d).add_to_graph(c-1);
            });
}

/* ----- RADAR CHART -----

  A radarchart (spiderchart) visualizing the features of each song*/

// Creates the svg for the graph
let svg_radar = d3.select('#radar_chart').append('svg')
    .attr('width', 800)
    .attr('height', 800);

// Creates a radial scale for the radar chart
let radialScale = d3.scaleLinear()
    .domain([0,1])
    .range([0,275]);

// Ticks of the axis
let ticks = [0.2,0.4,0.6,0.8,1];

// Adds a circle at each tick
ticks.forEach(t =>
svg_radar.append('circle')
    .attr('cx', 300)
    .attr('cy', 300)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('r', radialScale(t))
    );

// Label for the ticks
ticks.forEach(t =>
svg_radar.append('text')
    .attr('x', 305)
    .attr('y', 300 - radialScale(t))
    .text(t.toString())
    );

// Function to get the coordinates from angle
function angleToCoordinate(angle, value){

    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);

    return {'x': 300 + x, 'y': 300 - y};
    }

for (var i = 0; i < features.length; i++) {

    // Declaration of angle and coordinates (depending on the nb of features)
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 1);
    let label_coordinate = angleToCoordinate(angle, 1.05);

    // transformation value for each feature
    let ft_transform = ['translate(-27,-2.5)',
                        `rotate(-73,${label_coordinate.x},
                        ${label_coordinate.y}) translate(-45,0)`,
                        `rotate(37,${label_coordinate.x},
                        ${label_coordinate.y}) translate(-25,10)`,
                        `rotate(-35,${label_coordinate.x},
                        ${label_coordinate.y}) translate(-40,10)`,
                        `rotate(73,${label_coordinate.x},
                        ${label_coordinate.y}) translate(-30,0)`];

    //draw axis lines
    svg_radar.append('line')
        .attr('x1', 300)
        .attr('y1', 300)
        .attr('x2', line_coordinate.x)
        .attr('y2', line_coordinate.y)
        .attr('stroke','black');

    //draw axis labels
    svg_radar.append('text')
        .attr('x', label_coordinate.x)
        .attr('y', label_coordinate.y)
        .text(features[i])
        .attr('transform', function(){
            return ft_transform[i]
        })
    }

// Declaration of the line
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

// Gives the coordinate of a datapoint
function getPathCoordinates(data_point){

// Declaration of a list for the coordinates
let coordinates = [];
// Gets the coordinates for each feature
for (var i = 0; i < features.length; i++){

    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    coordinates.push(angleToCoordinate(angle, data_point[features[i]]));
    }

return coordinates;
}


// List that contains rank of each song on te graph
let on_graph = [];

function radar_chart(d) {

    let colors = manage_colors(d).colors;

    // Add a song to the graph with it's id (rank)
    function add_to_graph(index) {

    // checks if the song is on the graph
        if (on_graph.includes(+index) == false) {
            // adds song to the graph
            svg_radar.append('path')
               .datum(getPathCoordinates(d[index]))
               .attr('id', 'song_path')
               .attr('d',line)
               .attr('stroke-width', 3)
               .attr('stroke', colors[index])
               .attr('fill', colors[index])
               .attr('stroke-opacity', 1)
               .attr('opacity', 0.3);

            on_graph.push(+index)
            }

        else {
            console.log('song already on graph')
            }           

        };

    // creates a select option for each song in the dataset
    let select = document.getElementById('select_song');
    for (let i = 0; i< d.length; i++){
        
        let option = document.createElement('option');
        let artist = d[i].artist;
        let title = d[i].title;
        
        // id as option value
        option.value = i;
        // title and artit as option label
        option.innerHTML = `${title} - ${artist}`;
        
        select.appendChild(option);
        }

    // add the selected song to the graph
    let song = document.querySelector('#select_song')
    song.addEventListener('change', function(){

            let song_id = song.value;
            console.log(song_id);
            if (song_id != 'home') {
                add_to_graph(song_id); 

            }    
    });

    // clears the graph
    document.querySelector('#btn_clear').addEventListener('click', function() {
        // clear the graph and list
        d3.selectAll('#song_path').remove();
        on_graph.length = 0;
        song.value = 'home';
        console.log('graph cleared');
    });

    // shows all the songs on the graph
    document.querySelector('#btn_show').addEventListener('click', function() {

        // show all songs and add them to the list
        for (let i=0; i<d.length;i++){
            if (on_graph.includes(i) == false ) {
                add_to_graph(i);
            } 
        };
        song.value = 'home'
        console.log('all songs added to the graph');
    });

    return {add_to_graph}
}

/* ----- SCATTER PLOT ----- 

  A scatterplot visualizing the relation between the features for each song. */

function scatter_plot(d,c) {
    // Populates the select option with the features
    for (let p = 1; p <= 2; p++){

        let select = document.getElementById(`select_param${p}`);

            for (let i = 0; i< features.length; i++){

                let option = document.createElement('option');
                let feature = features[i];
            
                // feature name as option value
                option.value = feature;
                // title and artit as option label
                option.innerHTML = feature;

                select.appendChild(option);
                };
        };
    
    // Declaration of colorScale
    let colorScale = manage_colors(d).colorScale;

    // Creates the svg for the scatter plot
    let scat_svg = d3.select('#cor_plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);

    // Declaration of the x axis
    let x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);

    // Creates the x axis
    scat_svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
                .tickSizeInner(-height)); //vertical line of the grid

    // Declaration of the y axis
    let y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0]);

    // Creates the y axis
    scat_svg.append('g')
        .call(d3.axisLeft(y)
            .tickSizeInner(-width)); //horizontal line of the grid

    // Draws the point when a new feature is selected
    document.querySelector('#select_param1').addEventListener('change', function(){
        draw_points()
        });

    document.querySelector('#select_param2').addEventListener('change', function(){
        draw_points()
      });

    // Label for the correlation line
    scat_svg.append('rect')
      .attr('x', x(0.05)-15)
      .attr('y', y(0.95)-20)
      .attr('height', 10)
      .attr('width', 10)
      .attr('fill', colorScale(25));
    
    scat_svg.append('text')
      .attr('x', x(0.05))
      .attr('y', y(0.95)-11)
      .text('correlation')
      .attr('fill', colorScale(25));

    // Declaration of the tooltip for the scatterplot
    let scat_tooltip = d3.select('#cor_plot')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', '#ffffff')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '3px')
        .style('padding', '3px');

    // Function that draws the points for each song
    function draw_points() {

        // Retrieve the selected feature
        let param1 = document.querySelector('#select_param1').value;
        let param2 = document.querySelector('#select_param2').value;

        // Removes existing points and labels
        scat_svg.selectAll('circle').remove();
        scat_svg.selectAll('#scat_label').remove();
        scat_svg.selectAll('#cor_line').remove();

        // Matches the features with it's id in the correlation csv
        let cor_index = {energy: 1, danceability: 2, valence: 4, acousticness: 6, popularity: 7};
        let cor = c[cor_index[param1]][`${param2}`];

        // Draws a line with the correlation value
        scat_svg.append('line')
            .datum(c)
            .style("stroke", colorScale(25))
            .style('opacity', 0.9)
            .style('stroke-width', 2)
            .attr('id', 'cor_line')
            .attr('x1', x(0))
            .attr('y1', y(0))
            .attr('x2', x(1))
            .attr('y2', function(c) {return y(cor)});

        // Creates à point for each song
        scat_svg.append('g')
            .selectAll('dot')
            .data(d)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return x(d[`${param1}`]); } )
            .attr('cy', function (d) { return y(d[`${param2}`]); } )
            .attr('r', 5)
            .style('fill', function (d) { return colorScale(d.rank)})
            .style('opacity', 0.8)
            .on('mouseover', function(){
                // Changes style/shows the tooltip when the mouse hovers a point
                scat_tooltip.style('opacity', 1);
                d3.select(this).style('stroke', 'black').style('opacity', 1);
                })
            .on('mousemove', function(d){
                // Shows the title and author when the mouse hovers a point
                scat_tooltip.html(`${d.title} - ${d.artist}`)
                    // Adjusts the position of the tooltip
                    .style('left', d3.event.pageX+ 10 + 'px')
                    .style('top', d3.event.pageY - 25 + 'px');
                })
            .on('mouseleave', function(){
                // Hides the tooltip and puts initial style to the point
                scat_tooltip.style('opacity', 0);
                d3.select(this).style('stroke', 'none').style('opacity',0.8)
                });
        
        // Creates a label for the x axis with te selected feature 
        scat_svg.append('text')
            .attr('id', 'scat_label')
            .attr('x', width/2)
            .attr('y', height+margin.bottom-5)
            .style("text-anchor", "middle")
            .text(param1)
        
        // Creates a label for the y axis with te selected feature 
        scat_svg.append("text")
            .attr('id', 'scat_label')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left+5)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(param2);     
        };
    // Calls the function to show points launch
    draw_points();
};