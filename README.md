# Spotify top 50 of 2021 Analysis

## Description and objectives
This project was made for the class _Visualisation de données_ given by Isaac Pante at UNIL.

The main objective was to generate a data visualisation using the D3.js Library.

This project focuses on Spotify's most streamed titles of 2021. It tries to show the relation between several properties Spotify gives each song and to see if they are correlated. It also allows the users to compare the songs and their properties. 

The website consists of three different visualisations:
1. An interactive radar chart, showing the amount of each property, where the user chooses the songs he want's to compare.
![The radar chart](https://github.com/Squidez/spotify_top_50_2021/blob/main/Readme%20Img/radar_chart.PNG)

2. A scatter plot, showing every song according to two chosen properties.
![The scatter plot](https://github.com/Squidez/spotify_top_50_2021/blob/main/Readme%20Img/scatter_plot.PNG)

3. A correlation matrix between the properties.
![The Correlation Matrix](https://github.com/Squidez/spotify_top_50_2021/blob/main/Readme%20Img/corr_matrix.PNG)

## Data
The data was extracted using [Organize Your Music](http://organizeyourmusic.playlistmachinery.com/#).
The correlation matrix was done using R.

* rank : position of the song in the top 50
* title : title of the song
* artist : artist of the song
* genre : music genre of the song
* year : release year of the song
* bpm : tempo in beats per minute
* energy : measure, from 0 to 1, of intensity and activity
* danceability : measure, from 0 to 1, of how suitable track is for dancing
* decibel : average loudness of the track, from -60 to 0 db
* valence : measure, from 0 to 1, of the positivity conveyed by the track
* duration : duration of the track in ms
* acousticness : confidence measure from 0 to 1 * of whether the track is acoustic
* popularity : measure, from 0 to 1, of the popularity of the track

Detailled information about these properties can be found [on Spotify's API documentation](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features). 

## Installation requirements
The website is  either live at https://squidez.github.io/spotify_top_50_2021/ or you can clone the project and excecute _index.html_.
 
## Ressource and Packages
The project uses these packages:
* d3.js : https://d3js.org/d3.v4.min.js
* js-colormaps : github.com/timothygebhard/js-colormaps
* Bootstrap : https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css

The graph were inspired by:
* https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
* https://d3-graph-gallery.com/graph/scatter_tooltip.html
* https://d3-graph-gallery.com/graph/correlogram_basic.html

## Conclusion
Being used to R, it took some time to adapt to D3. Although it's a powerful tool, it felt quite laborious for certain basic tasks.

Concerning the results of the visualisation, the different qualifications given by Spotify seem to be quite independent one from another.
But the corpus is rather small and the a bigger top would probably show better results.

A nice addition to this project could be to work with Spotify's API to let the users choose which playlist they want to analyse.
