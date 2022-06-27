let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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
    

    let features = ['energy','danceability','valence','acousticness','popularity'];

    for (let p = 1; p < 3; p++){
    
    let select = document.getElementById(`select_param${p}`);

        for (let i = 0; i< features.length; i++){

            let option = document.createElement('option');
            let feature = features[i];
        
            // id as option value
            option.value = feature;
            // title and artit as option label
            option.innerHTML = feature;

            select.appendChild(option);
            };
    };

    let scat_svg = d3.select('#cor_plot')
        .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform',`translate(${margin.left},${margin.top})`);

    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0, width ]);
    scat_svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, 1])
      .range([ height, 0]);

    scat_svg.append('g')
      .call(d3.axisLeft(y));

    document.querySelector('#btn_cor').addEventListener('click', function(){

        scat_svg.selectAll('circle').remove()

        let param1 = document.querySelector('#select_param1').value;
        let param2 = document.querySelector('#select_param2').value;

        scat_svg.append('g')
            .selectAll('dot')
            .data(d)
            .enter()
            .append('circle')
            .attr('cx', function (d) { return x(d[`${param1}`]); } )
            .attr('cy', function (d) { return y(d[`${param2}`]); } )
            .attr('r', 5)
            .style('fill', '#DB5C68');
    })
    
    });
