function google_or_us(response) {
    console.log(response)
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
        console.log('step', step)
        if (step.transit_type == "WALKING") {
            journey_time_array.push(step.walking_time_value)
        } else if (step.transit_type == "TRANSIT") {
            journey_time_array.push(step.transit_time)
        }
    });
/*    console.log(journey_time_array)
    console.log(response_array[0].departure_time)
    console.log(journey_time_array.reduce((a, b) => a + b, 0))
    console.log(journey_time_array.reduce((a, b) => a + b, 0) + (response_array[0].departure_time) / 1000)*/

    var date = new Date(journey_time_array.reduce((a, b) => a + b, 0) * 1000 + (response_array[0].departure_time));
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    formatted_time = hours + ':' + minutes.substr(-2);
    return formatted_time;
}


function get_walking_time(array) {
    const response_array = array
    walking_time_array = []
    response_array.forEach(function (step) {
        console.log('step', step)
        if (step.transit_type == "WALKING") {
            walking_time_array.push(step.walking_time_value)
        }});
    let time = (walking_time_array.reduce((a, b) => a + b, 0) / 60).toFixed(0)
    return time;
}

function get_full_journey_time(array) {
    const response_array = array
    full_journey_time_array = []
    response_array.forEach(function (step) {
        console.log('step', step)
        if (step.transit_type == "WALKING") {
            full_journey_time_array.push(step.walking_time_value)
        } else if (step.transit_type == "TRANSIT") {
            full_journey_time_array.push(step.transit_time)
        }
    });

    let time = (full_journey_time_array.reduce((a, b) => a + b, 0) / 60).toFixed(0)
    return time;
}


function results_display(array) {
    const response_array = array
    let journey_instructions = `<div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">` +
        '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        `<h3 class="timeline-title">Depart at: ${response_array[0].departure_time_text}</h3></div></div>`;

    response_array.forEach(function (step) {
        console.log('step', step)
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
    journey_instructions += '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        '<h3 class="timeline-title">Arrive at: ' + get_arrival_time(response_array) + '</h3>' +
        `</div></div></div>`;

    // Add the timeline to the page
    return journey_instructions;

}
