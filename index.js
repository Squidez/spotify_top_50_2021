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

    console.log(d);

    let global_data = d;
    
    // list that contains rank of each song on te graph
    let on_graph = [];

    // add a song to the graph with it's id (rank)
    function add_to_graph(index) {
        
        // checks if the song is on the graph
        if (on_graph.includes(+index) == false) {
            // adds song to the graph
            svg_radar.append("path")
               .datum(getPathCoordinates(d[index]))
               .attr("d",line)
               .attr("stroke-width", 3)
               .attr("stroke", colors[index])
               .attr("fill", colors[index])
               .attr("stroke-opacity", 1)
               .attr("opacity", 0.3);
            
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

    // creates a color list
    let colors = [];
    for (let i = 0 ; i < d.length + 1; i++) {
        // gets color from a colormap
        let rgb_color = viridis_r(i/d.length); // returns a list

        // transforms the list to a rgb() format
        let color = `rgb(${rgb_color[0]},${rgb_color[1]},${rgb_color[2]})`;
        colors.push(color);    
    }
    
    let svg_color = d3.select("#rank_color").append('svg')
        .attr('width', 800)
        .attr('height', 200);

    // creates a domain with the ranks
    let domain = d3.range(1,d.length+1,1);
        
    let x_scale = d3.scaleBand()
        .domain(domain)
        .range([20,680]);

    // create x axis with only multiple of 10 shown
    let x_axis = d3.axisBottom(x_scale)
        .tickValues(x_scale.domain().filter(function(i){ return !(i%5)}));

    svg_color.append('g')
        .attr('transform', 'translate(0,70)')
        .call(x_axis);

    let colorScale = d3.scaleOrdinal()
        .domain(domain)
        .range(colors);

    let tooltip = d3.select('#rank_color')
        .append('div')
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "3px")
        .style("padding", "3px");


    let mouseleave = function(d) {
        tooltip.style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    svg_color.selectAll('rect')
        .data(domain)
        .enter()
        .append('rect')
        .attr('x', (d) => x_scale(d))
        .attr('y', 40)
        .attr('width', 10)
        .attr('height', 30)
        .attr('fill', (d) => colorScale(d))
        .on('mouseover', function(){
            tooltip.style("opacity", 1);
            d3.select(this).style("stroke", "black").style("opacity", 1)
            })
        .on('mousemove', function(d){
            tooltip.html(d+' - '+global_data[d-1].title+' - '+global_data[d-1].artist)
                .style("left", (d3.mouse(this)[0] + 20) + "px")
                .style("top", (d3.mouse(this)[1] + 30) + "px")
            })
        .on('mouseleave', mouseleave);

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
        d3.selectAll('path').remove();
        on_graph.length = 0;
        song.value = 'home'
        console.log('graph cleared');
    });

    // shows all the songs on the graph
    document.querySelector('#btn_show').addEventListener('click', function() {
        // clear the graph and list
        d3.selectAll('path').remove();
        on_graph.length = 0;
        // show all songs and add them to the list
        for (let i=0; i<d.length;i++){
            add_to_graph(i);
        };
        song.value = 'home'
        console.log('all songs added to the graph');
    });

});

let features = ["energy", "danceability", "valence", "acousticness", "popularity"]

let svg_radar = d3.select("#radar_chart").append("svg")
    .attr("width", 800)
    .attr("height", 800);

let radialScale = d3.scaleLinear()
    .domain([0,1])
    .range([0,250]);
let ticks = [0.2,0.4,0.6,0.8,1];

ticks.forEach(t =>
    svg_radar.append("circle")
    .attr("cx", 300)
    .attr("cy", 300)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("r", radialScale(t))
    );

ticks.forEach(t =>
    svg_radar.append("text")
    .attr("x", 305)
    .attr("y", 300 - radialScale(t))
    .text(t.toString()) 
    );

function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 300 + x, "y": 300 - y};
    }

for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 1);
    let label_coordinate = angleToCoordinate(angle, 1.05);

    //draw axis line
    svg_radar.append("line")
        .attr("x1", 300)
        .attr("y1", 300)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

    //draw axis label
    svg_radar.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
        }
    
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}