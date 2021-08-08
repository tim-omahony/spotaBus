// function to return provided details on travel to the prediction model
$(document).ready(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
        const inputTime = new Date($('#predictTime').val())
        $.ajax({
            type: 'POST',
            url: "/predict/",
            data:
                {
                    date_time: inputTime.getTime(),
                    route: RouteShortname,
                    hour: inputTime.getHours(),
                    day: inputTime.getDay(),
                    month: inputTime.getMonth(),
                    current_weather: Current_weather,
                    weather_forecast: Forecast_weather,
                    steps_array: Journey_Steps,
                    csrfmiddlewaretoken,
                    dataType: "json",
                },

            // if the function properly sends data to the predictive model the estimated travel time is returned
            success: function (result) {

                const response = {
                    'JourneyTime': result.JourneyTime,
                    'Weather': result.Weather,
                };

                const iconurl = "http://openweathermap.org/img/wn/" + response.Weather.icon + "@2x.png";

                $('#output').html("<p>" + results_display(Journey_Steps) + "</p>" +
                    "<p>Estimated Bus Journey Time: " + response.JourneyTime + " minutes</p>" +
                    " <div id='icon'><p>Weather Forecast:</p><img id='wicon' src=" + iconurl + "></div>"
                );

            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})

function results_display(array) {

    const hello = JSON.parse(array)

    console.log(hello)
    let journey_instructions = `<div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">`;

    hello.forEach(function (step) {
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
                `<p>Take the ${step.route}, hop off at ${step.arrival_stop}</p>` +
                `<span class="vertical-timeline-element-date">${step.step_distance}</span>` +
                `</div></div></div>`;
        }
    });
    journey_instructions += `</div>`;

    // Add the timeline to the page
    return journey_instructions;

}

/*function results_display(array) {

    const hello = JSON.parse(array)
    console.log(hello)
    console.log(hello[0].instructions)
    const Steps = array.length;
    route_instructions = []
    for (let y = 0; y <= Steps; y++) {
           route_instructions.push(hello[y].instructions);
    }
    return route_instructions;

}*/
