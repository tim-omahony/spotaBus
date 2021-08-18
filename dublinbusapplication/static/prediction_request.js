// function to return provided details on travel to the prediction model
function submitForm() {
    const inputTime = new Date($('#predictTime').val())
    // ajax post request takes the date, time, journey steps and weather info and passes it to the views.py
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

            //retrieving the resonse from AJAX
            const response = {
                'journey_steps_response': result.journey_steps_response,
                'JourneyTime': result.JourneyTime,
                'Weather': result.Weather,
                'prediction_type': result.prediction_type,
            };
            //fetching the weather icon form open weather maps API
            const iconurl = "http://openweathermap.org/img/wn/" + response.Weather.icon + "@2x.png";


            //converting the temperature from kelvin to degrees celcius
            var temperature = (response.Weather.temp - 273).toFixed(1);
            var journey_response = response.journey_steps_response

            //sending the journey planner output to the output div
            //see journey_planner_output.js for information on the functions being called below.
            $('#output').html("<div id = 'instructions-output'>" + resultsDisplay(journey_response) + "</div>" +
                "<div id = 'parent'><div id='total-estimate'><p>Journey Time: <br><b>" + getFullJourneyTime(journey_response) + " mins</b></p></div>" +
                "<div id = 'narrow'><i id='estimate-walking-icon' class='fas fa-walking'></i> <br><b>" + getWalkingTime(journey_response) + " mins</b></div>" +
                "<div id = 'wide'><i id='estimate-bus-icon' class='fas fa-bus'></i> <br><b> " + getTransitTime(journey_response) + " mins</b></div></div>" +
                "<div id='parenttwo'><div id='narrowtwo'><p>Weather Forecast:</p></div><div id ='widetwo'><img id='wicon' src=" + iconurl + ">" + temperature + "<span>&#176;</span></div></div>" +
                "<div id='google_or_us'>" + googleOrUs(response) + "</div>"
            );

            $('#analytics-output').html(analyticsDisplay(journey_response));

        },

        failure: function (result) {
            swal("Error!", "It seems we're having some technical difficulties, please try again.", "error");
            console.log(result)
        }
    })
}


