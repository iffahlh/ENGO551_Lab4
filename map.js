// map display
var map = L.map('map').setView([51.03, -114.066666], 10);

// tiles for calgary building permits
var permitTiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            }).addTo(map);

// mapbox tiles for calgary traffic incidents, mapbox access token to be set by event listener
var incidentTiles=L.tileLayer(`https://api.mapbox.com/styles/v1/iffahldy/cltdq3qxi00px01pt2u8tahp3/tiles/256/{z}/{x}/{y}?`, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });;

// toggling calgary building permits tilelayer by default
permitTiles.addTo(map);

// classes for overlapping markers and clustered markers
var oms = new OverlappingMarkerSpiderfier(map);
var popup=new L.Popup()
var markers = L.markerClusterGroup({disableClusteringAtZoom: 12});

// listeners for overlapping marker class to open/close popup
oms.addListener('click', function(marker) {
    popup.setContent(marker.desc);
    popup.setLatLng(marker.getLatLng());
    map.openPopup(popup);
});

oms.addListener('spiderfy', function(markers) {
map.closePopup();
});

// function to set api call
function handleFetch(date1, date2) {
    var target="";
    // sets date target depending on which date input is specified by the user
    if(date1!="" && date2==""){
        target=`issueddate=${date1}`;
    }else if (date1=="" && date2!=""){
        target=`issueddate=${date2}`;
    }else if(date1!="" && date2!=""){
        target=`$where=issueddate > '${date1}' and issueddate < '${date2}'`
    }

    // issuing api call 
    if (target!="") {
        fetch(' https://data.calgary.ca/resource/c2es-76ed.geojson?'+target,{
            method: 'get',
            dataType: 'jsonp',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                return response.json(); // Parse the response data as JSON
                } else {
                throw new Error('API request failed');
                }
            })
            .then(data => {
                // send received data to be displayed on map
                console.log(data); // Logging the data to the console
                displayMarkers(data)
                return data;
            })
            .catch(error => {
                // Handle any errors here
                console.error(error); // Logging the error to the console
            })
    }};

// displaying data received from api response on the map
function displayMarkers(data){
    features=data['features'];
    
    // iterating through each point in the api response
    for (feature of features) {
        // setting coordinates of marker
        let long=feature['properties']['longitude'];
        let lat=feature['properties']['latitude'];
        let marker=L.marker([lat, long]);

        //setting marker description to be displayed on popup 
        let issueddate=feature['properties']['issueddate']; 
        let wcg=feature['properties']['workclassgroup'];
        let contractor=feature['properties']['contractorname'];
        let community=feature['properties']['communityname'];
        let address=feature['properties']['originaladdress'];
        let message=`<b>issueddate: </b> ${issueddate}<br><b>workclassgroup: </b> ${wcg}<br><b>contractorname: </b> ${contractor}<br><b>communityname: </b> ${community}<br><b>originaladdress: </b> ${address}<br>`
        marker.desc=message;
        // adding marker to markerClusterGroup class
        markers.addLayer(marker);
        
        // adding the marker to OverlappingMarkerSpidifier class
        oms.addMarker(marker);  // <-- here
    }
    map.addLayer(markers)
}


// listener for date inputs to send to api call
document.querySelectorAll('.dateInput')
.forEach(function(element){
        element.addEventListener('change', function(event){
            map.removeLayer(markers)
            let d1=document.getElementById("date1").value;
            let d2=document.getElementById("date2").value;
            let response=handleFetch(d1,d2);
        });
});

// listener for mapbox access token
document.getElementById('mapboxToken').addEventListener('change', function(event){
    let access_token=event.currentTarget.value;
    incidentTiles=L.tileLayer(`https://api.mapbox.com/styles/v1/iffahldy/cltdq3qxi00px01pt2u8tahp3/tiles/256/{z}/{x}/{y}?access_token=${access_token}`, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    incidentTiles.addTo(map);
    map.setView([51.03, -114.066666], 10)
})

// listener for toggling map layers
document.querySelectorAll('.form-check-input')
.forEach(function(element){
        element.addEventListener('change', function(event){
            if (event.currentTarget.getAttribute('id') == "permitCheck"){
                // unhide form for issueddate input and hide form for the mapbox access token
                document.getElementById("userDates").removeAttribute("hidden");
                document.getElementById("userAccessToken").setAttribute("hidden","hidden");
                // remove Traffic Incident tiles and replace with Building Permit tiles
                map.removeLayer(incidentTiles)
                permitTiles.addTo(map);
                // add previous markers to map
                map.addLayer(markers);
                map.setView([51.03, -114.066666], 10)
            } else if (event.currentTarget.getAttribute('id') == "incidentCheck"){
                // unhide form for the mapbox access token and hide form for issueddate input
                document.getElementById("userAccessToken").removeAttribute("hidden");
                document.getElementById("userDates").setAttribute("hidden", "hidden");
                // remove Building Permit markers and tiles then replace with Traffic Incident tiles
                map.removeLayer(markers)
                map.removeLayer(permitTiles)
                incidentTiles.addTo(map);
                map.setView([51.03, -114.066666], 10)
            }
            
        });
});
