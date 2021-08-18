let step_distance;
let arrival_stop;
let arrival_time;
let departure_time;
let departure_time_text;
let transit_departure_time;
let walking_time_text;
let walking_time_value;
let full_distance;

//creating the AutocompleteDirectionsHandler class to be called in InitMap
class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;

    //creating all instances and variables needed to render the map and fetch the directions service response
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
        //calling the getDateTime function which returns the inputted date the user selects
        const input_date = getDateTime();
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        const me = this;

        //applying specific parameters to the directions service request
        //such that the preferred mode of transport is by bus
        //and the departure time is as close as possible to the users inputted time
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

            //response from the directions service
            (response, status) => {
                googleResponse = response
                if (status === "OK") {

                    try {
                        //displaying the directions service response on the map
                        me.directionsRenderer.setDirections(response);

                        //getting the length of the response
                        const Steps = response.routes[0].legs[0].steps.length;

                        //creating an array in which the steps of the journey can be stored
                        steps_array = [];

                        //iterating over the response
                        for (let y = 0; y < Steps; y++) {

                            //creating a dictionary in which the response at each step is stored
                            const response_dictionary = {};

                            //getting the transit type of the current step
                            const Transit_Type = response.routes[0].legs[0].steps[y].travel_mode;

                            //creating a set of arrays in which the response is stored
                            Direction_Steps = [];
                            departure_time = [];
                            departure_time_text = [];
                            arrival_time = [];
                            step_distance = [];
                            walking_time_text = [];
                            walking_time_value = [];

                            //retrieving the response
                            Direction_Steps = response.routes[0].legs[0].steps[y].instructions;
                            departure_time = response.routes[0].legs[0].departure_time.value.getTime();
                            departure_time_text = response.routes[0].legs[0].departure_time['text'];
                            arrival_time = response.routes[0].legs[0].arrival_time['text'];
                            full_distance = response.routes[0].legs[0].distance['value'];

                            //adding the array of responses to the response dictionary
                            response_dictionary['instructions'] = Direction_Steps;
                            response_dictionary['departure_time'] = departure_time;
                            response_dictionary['departure_time_text'] = departure_time_text;
                            response_dictionary['arrival_time'] = arrival_time;
                            response_dictionary['full_distance'] = full_distance;

                            //gathering specific responses where transit type is walking
                            if (Transit_Type === "WALKING") {
                                step_distance = response.routes[0].legs[0].steps[y].distance['text'];
                                walking_time_text = response.routes[0].legs[0].steps[y].duration['text'];
                                walking_time_value = response.routes[0].legs[0].steps[y].duration['value'];

                                response_dictionary['step_distance'] = step_distance;
                                response_dictionary['walking_time_text'] = walking_time_text;
                                response_dictionary['walking_time_value'] = walking_time_value;
                                response_dictionary['transit_type'] = Transit_Type;
                            }

                            //gathering specific responses where transit type is TRANSIT
                            if (Transit_Type === "TRANSIT") {

                                // tripCO2Details(response.routes[0].legs[0].distance.value / 1000)

                                //creating a set of arrays in which the response is stored
                                arrival_stop = []
                                RouteShortname = [];
                                start_stop_lat_lon = [];
                                end_stop_lat_lon = [];
                                transit_departure_time = []

                                //retrieving the response
                                arrival_stop = response.routes[0].legs[0].steps[y].transit.arrival_stop['name'];
                                step_distance = response.routes[0].legs[0].steps[y].distance['text'];
                                RouteShortname = response.routes[0].legs[0].steps[y].transit.line.short_name;
                                transit_departure_time = response.routes[0].legs[0].steps[y].transit.departure_time['text'];
                                start_stop_lat_lon = response.routes[0].legs[0].steps[y].start_location.lat() + ',' + response.routes[0].legs[0].steps[y].start_location.lng();
                                end_stop_lat_lon = response.routes[0].legs[0].steps[y].end_location.lat() + ',' + response.routes[0].legs[0].steps[y].end_location.lng();
                                Google_Journey_time = response.routes[0].legs[0].steps[y].duration['value'];

                                //adding the array of responses to the response dictionary
                                response_dictionary['arrival_stop'] = arrival_stop;
                                response_dictionary['step_distance'] = step_distance;
                                response_dictionary['departure_time'] = departure_time;
                                response_dictionary['route'] = RouteShortname;
                                response_dictionary['transit_departure_time'] = transit_departure_time;
                                response_dictionary['start_stop_lat_lon'] = start_stop_lat_lon;
                                response_dictionary['end_stop_lat_lon'] = end_stop_lat_lon;
                                response_dictionary['transit_type'] = Transit_Type;
                                response_dictionary['Google_Journey_time'] = Google_Journey_time;
                            }

                            //pushing all of the responses to the main response_dictionary
                            steps_array.push(response_dictionary);
                        }

                        //error handling, displaying error message to the user.
                    } catch (err) {
                        swal("Error!", "It seems we're having some technical difficulties (you may have entered a route that doesn't require public transport), please refresh and try again.", "error");
                    }

                    //error handling
                } else {
                    window.alert("Directions request failed due to " + status);
                }
                //converting the steps array to a JSON object such that AJAX can send it to views.py
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
                drivingComparatorInfoPopulator(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
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
                cyclingComparatorInfoPopulator(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);
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
                    walkingComparatorInfoPopulator(response.routes[0].legs[0].duration.value, response.routes[0].legs[0].distance.value);


                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        )
        displayTransportComparator();
    }
}