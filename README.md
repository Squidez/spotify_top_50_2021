# Spotify top 50 of 2021 Analysis

## Description and objectives
This project was made for the class _Visualisation de données_ given by Isaac Pante at UNIL.

The main objective was to generate a data visualisation using the D3.js Library.

This project focuses on Spotify's most streamed titles of 2021. It tries to show the realtion between several properties Spotify gives each song and to see if they are correlated. It also allows the users to compare the songs and their properties. 

The website consist of three different visualisation:
1. An interactive radar chart, showing the amount of each propertie, where the user chooses the songs he want's to compare.
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
* year : realease year of the song
* bpm : tempo in beats per minute
* energy : mesure, from 0 to 1, of intencity and * activity
* danceability : mesure, from 0 to 1, of how * suitable track is for dancing
* decibel : average loudness of the track, from * -60 to 0 db
* valence : mesure, from 0 to 1, of the * positivity conveyed by the track
* duration : duration of the track in ms
* acousticness : confidence measure from 0 to 1 * of whether the track is acoustic
* popularity : mesure, from 0 to 1, of the * popularity of the track

Detailled information about these properties can be found [on Spotify's API documentation](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-several-audio-features). 

## Installation requirements
The website is  either live at https://squidez.github.io/spotify_top_50_2021/ or you can clone the project and excecute _index.html_.
 
## Ressource and Packages

The project uses these packages:
* d3.js : https://d3js.org/d3.v4.min.js
* js-colormaps : github.com/timothygebhard/js-colormaps
* Bootstrap : https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css

The graph are inspired by:
* https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
* https://d3-graph-gallery.com/graph/scatter_tooltip.html
* https://d3-graph-gallery.com/graph/correlogram_basic.html

## Conclusion 
