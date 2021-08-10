// function to return provided details on travel to the prediction model
$(document).ready(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
        const inputTime = new Date($('#predictTime').val())
        // ajax post request takes the date, time info on the stops and the weather and passes this to the backend
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
                    'journey_steps_response': result.journey_steps_response,
                    'JourneyTime': result.JourneyTime,
                    'Weather': result.Weather,
                    'prediction_type': result.prediction_type,
                };


                const iconurl = "http://openweathermap.org/img/wn/" + response.Weather.icon + "@2x.png";

                var temperature = (response.Weather.temp - 273).toFixed(1);
                console.log(response.journey_steps_response)
                var journey_response = response.journey_steps_response

                $('#output').html("<div id = 'instructions-output'>" + results_display(journey_response) + "</div>" +
                    "<div id = 'parent'><div id='total-estimate'><p>Journey Time: <br><b>" + get_full_journey_time(journey_response) + " mins</b></p></div>" +
                    "<div id = 'narrow'><i id='estimate-walking-icon' class='fas fa-walking'></i> <br><b>" + get_walking_time(journey_response) + " mins</b></div>" +
                    "<div id = 'wide'><i id='estimate-bus-icon' class='fas fa-bus'></i> <br><b> " + (response.JourneyTime / 60).toFixed(0) + " mins</b></div></div>" +
                    "<div id='weather-icon'><p>Weather Forecast:</p><p>" + temperature + "<span>&#176;</span><img id='wicon' src=" + iconurl + "></p></div>" +
                    "<div>" + google_or_us(response) + "</div>"
                );

            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})
