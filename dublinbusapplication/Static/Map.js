const DUBLIN_LAT = 53.349804;
const DUBLIN_LNG = -6.260310;

const DUBLIN_BOUNDS = {
    north: 53.4,
    south: 53.3,
    west: -6.3103,
    east: -6.2305,
};

let map;
let markers;
let stops;

function initMap() {
    map = new google.maps.Map(document.getElementById("MapView"), {
        center: {lat: DUBLIN_LAT, lng: DUBLIN_LNG},
        zoom: 14,
        // restriction: {
        //     latLngBounds: DUBLIN_BOUNDS,
        //     strictBounds: false,
        // }
    });
    populateStops(map);

    infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Click to see my position";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Your location.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

}


function populateStops(map) {
    fetch('stops/').then(async response => {
        const data = await response.json();
        stops = data.stops;
        markers = stops.map(stop => {
            return new google.maps.Marker({
                position: {
                    lat: Number.parseFloat(stop.stop_lat),
                    lng: Number.parseFloat(stop.stop_lon)
                },
                title: stop.stop_name,
                map: map
            })
        });
        new MarkerClusterer(map, markers, {
            imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
    })
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  }

