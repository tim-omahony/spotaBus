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
let pos;


function initMap() {
        map = new google.maps.Map(document.getElementById("MapView"), {
            center: {lat: DUBLIN_LAT, lng: DUBLIN_LNG},
            zoom: 14,
            // restriction: {
            //     latLngBounds: DUBLIN_BOUNDS,
            //     strictBounds: false,
            // }
        });

        new AutocompleteDirectionsHandler(map);
}

function attachInstructionText(stepDisplay, marker, text, map) {
              google.maps.event.addListener(marker, "click", () => {
                // Open an info window when the marker is clicked on, containing the text
                // of the step.
                stepDisplay.setContent(text);
                stepDisplay.open(map, marker);
              });
}

function DistanceMatrix(){
   const bounds = new google.maps.LatLngBounds();
   const markersArray = [];

    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();


    // build request
    // const origin1 = pos;
    const origin1 = {lat: 53.349804, lng: -6.260310}
    const origin2 = "Your Location";
    const destinationA = "Stockholm, Sweden";
    const destinationB = {lat: 55.93, lng: -3.120};
    const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };

    // document.getElementById("request").innerText = JSON.stringify(
    //     request,
    //     null,
    //     2
    // );
    // get distance matrix response
    service.getDistanceMatrix(request).then((response) => {
        // put response
        // document.getElementById("response").innerText = JSON.stringify(
        //     response,
        //     null,
        //     2
        // );
        // show on map
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        // deleteMarkers(markersArray);

        const showGeocodedAddressOnMap = (asDestination) => {
            const handler = ({results}) => {
                map.fitBounds(bounds.extend(results[0].geometry.location));
                markersArray.push(
                    new google.maps.Marker({
                        map,
                        position: results[0].geometry.location,
                        label: asDestination ? "D" : "O",
                    })
                );
            };
            return handler;
        };

        for (let i = 0; i < originList.length; i++) {
            const results = response.rows[i].elements;
            geocoder
                .geocode({address: originList[i]})
                .then(showGeocodedAddressOnMap(false));

            for (let j = 0; j < results.length; j++) {
                geocoder
                    .geocode({address: destinationList[j]})
                    .then(showGeocodedAddressOnMap(true));
            }
        }
    });
}

function Geolocation(){
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


function deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
        markersArray[i].setMap(null);
    }
    markersArray = [];
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


class AutocompleteDirectionsHandler {
  map;
  originPlaceId;
  destinationPlaceId;
  travelMode;
  directionsService;
  directionsRenderer;
  constructor(map) {
    this.map = map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.travelMode = google.maps.TravelMode.TRANSIT;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    const originAutocomplete = new google.maps.places.Autocomplete(originInput);

    // Specify just the place data fields that you need.
    originAutocomplete.setFields(["place_id"]);
    const destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput
    );
    // Specify just the place data fields that you need.
    destinationAutocomplete.setFields(["place_id"]);

    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
  }


  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo("bounds", this.map);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert("Please select an option from the dropdown list.");
        return;
      }
      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      this.route();
    });
  }

  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: 'TRANSIT',
      },

      (response, status) => {
        if (status === "OK") {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
}




