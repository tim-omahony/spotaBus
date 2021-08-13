//This function checks the response type and returns a HTML div with a message indicating that the
//journey time estimates have been retrieved from the google maps API
function google_or_us(response) {
    let response_type = '<div id = "google_or_us"><div id ="google_container">';

    if (response.prediction_type['type'] == "google") {
        response_type += 'This result is powered by: <img id = "google_maps_logo" src="https://logos-download.com/wp-content/uploads/2016/05/Google_Maps_logo_wordmark.png">';
    }
    response_type += '</div></div>';
    return response_type;
}


// this function takes each step of the journey in an array, sums up these estimates and adds them to the UNIX time of
// departure, this unix time is then converted to hours and minutes and returned in string format.
function get_arrival_time(array) {
    const response_array = array
    journey_time_array = []
    response_array.forEach(function (step) {
        if (step.transit_type == "WALKING") {
            journey_time_array.push(step.walking_time_value)
        } else if (step.transit_type == "TRANSIT") {
            journey_time_array.push(step.transit_time)
        }
    });

    // a date variable is created with the sum of the array of travel times (mulitplied by 1000 to match UNIX time of google response)
    // and the departure time from the google response in UNIX format
    var date = new Date(journey_time_array.reduce((a, b) => a + b, 0) * 1000 + (response_array[0].departure_time));

    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    //string object created with the arrival time
    formatted_time = hours + ':' + minutes.substr(-2);
    return formatted_time;
}

//function which retrieves the total time spent walking from the AJAX response
function get_walking_time(array) {
    const response_array = array
    walking_time_array = []

    //for loop iterates over the AJAX response and adds the walking time to an array
    response_array.forEach(function (step) {
        if (step.transit_type == "WALKING") {
            walking_time_array.push(step.walking_time_value)
        }
    });

    //the summation of the array is retrieved and returned
    let time = (walking_time_array.reduce((a, b) => a + b, 0) / 60).toFixed(0)
    return time;
}


function get_transit_time(array) {
    const response_array = array
    transit_time_array = []

    //for loop iterates over the AJAX response and adds the walking time to an array
    response_array.forEach(function (step) {
        if (step.transit_type == "TRANSIT") {
            transit_time_array.push(step.transit_time)
        }
    });

    //the summation of the array is retrieved and returned
    let time = (transit_time_array.reduce((a, b) => a + b, 0) / 60).toFixed(0)
    return time;
}

////function which retrieves the full journey time from the AJAX response
function get_full_journey_time(array) {
    var sum = parseInt(get_walking_time(array)) + parseInt(get_transit_time(array));
    return sum
}


//This function iterates over the AJAX response and creates a timeline of the relevant journey instructions
//the timeline is created using a bootstrap class
//the elements are added iteratively for each step of the journey
//this HTML variable is then returned to prediction_request to be displayed
function results_display(array) {
    const response_array = array
    let journey_instructions = `<div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">` +
        '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        `<h3 class="timeline-title">Depart at: ${response_array[0].departure_time_text}</h3></div></div>`;

    //for each loop iterates over the AJAX response and retrieves the relevant elements at each step
    response_array.forEach(function (step) {
        if (step.transit_type == "WALKING") {
            journey_instructions +=
                '<div class="vertical-timeline-item vertical-timeline-element">' +
                '<div> <span class="vertical-timeline-element-icon bounce-in"> <i class="fas fa-walking"></i> </span>' +
                `<div class="vertical-timeline-element-content bounce-in">` +
                `<h3 class="timeline-title">${step.instructions}</h3>` +
                `<p>${step.walking_time_text}</p>` +
                `<p><span class="vertical-timeline-element-date">${step.step_distance}</span></p><br>` +
                `</div></div></div>`;

        } else if (step.transit_type == "TRANSIT") {
            journey_instructions +=
                '<div class="vertical-timeline-item vertical-timeline-element">' +
                '<div> <span class="vertical-timeline-element-icon bounce-in"><i class="fas fa-bus"></i> </span>' +
                `<div class="vertical-timeline-element-content bounce-in">` +
                `<h3 class="timeline-title">${step.instructions}</h3>` +
                `<p>Take the <b>${step.route}</b> bus at <b>${step.transit_departure_time}</b>, hop off at ${step.arrival_stop}</p>` +
                `<p>${(step.transit_time / 60).toFixed(0)} mins</p>` +
                `<span class="vertical-timeline-element-date">${step.step_distance}</span>` +
                `</div></div></div>`;
        }
    });

    //calling the get_arrival_time function to display the arrival time dynamically.
    journey_instructions += '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        '<h3 class="timeline-title">Arrive at: ' + get_arrival_time(response_array) + '</h3>' +
        `</div></div></div>`;

    // Add the timeline to the page
    return journey_instructions;

}
