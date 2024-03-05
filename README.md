# ENGO551_Lab4
This project is an extension of [Lab 3](https://github.com/iffahlh/ENGO551_Lab3), which is a website that allows users to query building permits in Calgary by date of issue (or ranges for dates of issue) via the Open Calgary API and then displays the locations of queried building permits on an interactive map. Lab4 adds the option to toggle a custom map layer that calls the Mapbox API (when the user provides a valid Mapbox access token) to display Traffic Incident data that occurred in Calgary in 2017. The Traffic Incident data was also obtained from Open Calgary. 

The video demo for this project can be found [here](https://www.youtube.com/watch?v=XymryKKfXi4)

This website was built with HTML and Javascript. The following tools, libraries and plugins were used in development:
- **[Leaflet.js](https://github.com/Leaflet/Leaflet)** for creating the interactive map
- **[Leaflet.marketcluster](https://github.com/Leaflet/Leaflet.markercluster)** to provide Marker Clustering functionality at certain zoom levels
- **[OverlappingMarkerSpiderfier-Leaflet](https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet)** to provide Google Earth-like functionality for overlapping markers
- **[Bootstrap 5](https://github.com/twbs/bootstrap)** to create the grid layout of the HTML page and styles for mapbox access token input and the radio-button-styled checkboxes used for toggling map layers
- **[Mapbox Studio Style Editor](https://docs.mapbox.com/studio-manual/reference/styles/)** to create the custom map layer for Calgary Traffic Incidents in 2017

## Project Files
**map.html** - HTML file defining the layout of the site and functionality for user inputs

**map.js** - Javascript file providing the map, api functionality, and listeners for HTML inputs