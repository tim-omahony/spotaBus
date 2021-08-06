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
        const options = {
            componentRestrictions: {country: "ie"}
        };
        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        const originAutocomplete = new google.maps.places.Autocomplete(originInput, options);
        // Specify just the place data fields that you need.
        originAutocomplete.setFields(["place_id"]);
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, options
        );


        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
    }


    // provides the route between two given stops

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
        var input_date = getDateTime();
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        const me = this;
        this.directionsService.route(
            {
                origin: {placeId: this.originPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: 'TRANSIT',
                transitOptions: {
                    modes: ['BUS'],
                    routingPreference: 'FEWER_TRANSFERS',
                    departureTime: new Date(input_date)
                }
            },

            (response, status) => {
                googleResponse = response
                if (status === "OK") {
                    me.directionsRenderer.setDirections(response);

                    var Steps = response.routes[0].legs[0].steps.length;
                    steps_array = [];

                    for (var y = 0; y < Steps; y++) {
                        var route_dict = {};
                        var Transit_Type = response.routes[0].legs[0].steps[y].travel_mode;

                        Direction_Steps = [];
                        Direction_Steps = response.routes[0].legs[0].steps[y].instructions;

                        route_dict['instructions'] = Direction_Steps;


                        if (Transit_Type === "WALKING") {
                            route_dict['transit_type'] = Transit_Type;
                        }

                        if (Transit_Type === "TRANSIT") {

                            tripCO2Details(response.routes[0].legs[0].distance.value/1000)


                            RouteShortname = [];
                            start_stop_lat_lon = [];
                            end_stop_lat_lon = [];

                            RouteShortname = response.routes[0].legs[0].steps[y].transit.line.short_name;
                            start_stop_lat_lon = response.routes[0].legs[0].steps[y].start_location.lat() + ',' + response.routes[0].legs[0].steps[y].start_location.lng();
                            end_stop_lat_lon = response.routes[0].legs[0].steps[y].end_location.lat() + ',' + response.routes[0].legs[0].steps[y].end_location.lng();
                            Google_Journey_time = response.routes[0].legs[0].steps[y].duration['value']

                            route_dict['route'] = RouteShortname;
                            route_dict['start_stop_lat_lon'] = start_stop_lat_lon;
                            route_dict['end_stop_lat_lon'] = end_stop_lat_lon;
                            route_dict['transit_type'] = Transit_Type;
                            route_dict['Google_Journey_time'] = Google_Journey_time;
                        }
                        steps_array.push(route_dict);
                    }

                    console.log(response)
                    console.log(steps_array)

                } else {
                    window.alert("Directions request failed due to " + status);
                }

                Journey_Steps = JSON.stringify(steps_array);
            }
        )

        this.directionsService.route(
            {
                origin: {placeId: this.originPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: 'DRIVING',
            },

            (response, status) => {
                //passing response to the populator function to update html divs
                drivingComparatorInfoPopulator(response.routes[0].legs[0].duration.value,response.routes[0].legs[0].distance.value);
                if (status === "OK") {


                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        )

        this.directionsService.route(
            {
                origin: {placeId: this.originPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: 'BICYCLING',
            },

            (response, status) => {
                //passing response to the populator function to update html divs
                cyclingComparatorInfoPopulator(response.routes[0].legs[0].duration.value,response.routes[0].legs[0].distance.value);
                if (status === "OK") {


                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        )

        this.directionsService.route(
            {
                origin: {placeId: this.originPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: 'WALKING',
            },

            (response, status) => {
                if (status === "OK") {
                    walkingComparatorInfoPopulator(response.routes[0].legs[0].duration.value,response.routes[0].legs[0].distance.value);


                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        )
        displayTransportComparator();


    }
}

function tripCO2Details(distance) {

    var tag = document.createElement("hr");
    var element = document.getElementById("busCO2Details");
    element.appendChild(tag);

    var tagP = document.createElement("p");
    var textP = document.createTextNode("Your selected trip is "+ distance + " km long. At 23g CO2 emissions per seat km, your journey would generate "+ Math.round(23*distance) + "g of C02.");

    element.appendChild(textP);

}

//function to take the user input from the date picker to be passed to the google directions service API
function getDateTime() {
    var regDate = document.getElementById("predictTime").value;
    console.log(regDate);
    unixdate = Date.parse(regDate);

    if (unixdate < Date.now()) {
        date_picked = Date.now();
    }else{
        date_picked = unixdate;
    }
    console.log(unixdate);

    return date_picked;
}


function drivingComparatorInfoPopulator(duration, distance) {
    //populates information fields for various journey transit methods

    document.getElementById("drivingTransitTime").innerHTML = Math.round(duration/60) + " minute(s)";
    document.getElementById("drivingTransitDistance").innerHTML = distance/1000 + " km";



}

function walkingComparatorInfoPopulator(duration, distance) {
    //populates information fields for various journey transit methods

    document.getElementById("walkingTransitTime").innerHTML = Math.round(duration/60) + " minute(s)";
    document.getElementById("walkingTransitDistance").innerHTML = distance/1000 + " km";



}

function cyclingComparatorInfoPopulator(duration, distance) {
    //populates information fields for various journey transit methods

    document.getElementById("cycleTransitTime").innerHTML = Math.round(duration/60) + " minute(s)";
    document.getElementById("cycleTransitDistance").innerHTML = distance/1000 + " km";
 }

 function displayC02Comparator() {
    document.getElementById("c02Comparator").style.display = "inline";
    $("#c02Comparator").slideDown();
 }

 function displayTransportComparator() {
    document.getElementById("journeyComparer").style.display = "inline";
    $("#journeyComparer").slideDown();
 }



