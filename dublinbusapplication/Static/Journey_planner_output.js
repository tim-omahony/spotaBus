function google_or_us(response) {
    console.log(response)
    let response_type = '<p>';
    if (response.prediction_type['type'] == "google") {
        response_type += 'googles prediction';
    }
    response_type += '</p>';
    return response_type;
}

function results_display(array) {

    const response_array = JSON.parse(array)

    let journey_instructions = `<div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">` +
        '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        `<h3 class="timeline-title">${response_array[0].departure_time}</h3></div></div>`;

    response_array.forEach(function (step) {
        console.log('step', step)
        if (step.transit_type == "WALKING") {
            journey_instructions +=
                '<div class="vertical-timeline-item vertical-timeline-element">' +
                '<div> <span class="vertical-timeline-element-icon bounce-in"> <i class="fas fa-walking"></i> </span>' +
                `<div class="vertical-timeline-element-content bounce-in">` +
                `<h3 class="timeline-title">${step.instructions}</h3>` +
                `<span class="vertical-timeline-element-date">${step.step_distance}</span>` +
                `</div></div></div>`;

        } else if (step.transit_type == "TRANSIT") {
            journey_instructions +=
                '<div class="vertical-timeline-item vertical-timeline-element">' +
                '<div> <span class="vertical-timeline-element-icon bounce-in"><i class="fas fa-bus"></i> </span>' +
                `<div class="vertical-timeline-element-content bounce-in">` +
                `<h3 class="timeline-title">${step.instructions}</h3>` +
                `<p>Take the <b>${step.route}</b> bus at <b>${step.transit_departure_time}</b>, hop off at ${step.arrival_stop}</p>` +
                `<span class="vertical-timeline-element-date">${step.step_distance}</span>` +
                `</div></div></div>`;
        }
    });

    journey_instructions += '<div class="vertical-timeline-item vertical-timeline-element">' +
        `<div class="vertical-timeline-element-content bounce-in">` +
        `<h3 class="timeline-title">${response_array[0].arrival_time}</h3>` +
        `</div></div></div>`;

    // Add the timeline to the page
    return journey_instructions;

}
