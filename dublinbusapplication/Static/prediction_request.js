// function to return provided details on travel to the prediction model
$(document).ready(function () {
    $('#form').on('submit', function (e) {
        e.preventDefault();
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
                console.log(response.journey_steps_response)
                var journey_response = response.journey_steps_response

                //sending the journey planner output to the output div
                //see Journey_planner_output.js for information on the functions being called below.
                $('#output').html("<div id = 'instructions-output'>" + results_display(journey_response) + "</div>" +
                    "<div id = 'parent'><div id='total-estimate'><p>Journey Time: <br><b>" + get_full_journey_time(journey_response) + " mins</b></p></div>" +
                    "<div id = 'narrow'><i id='estimate-walking-icon' class='fas fa-walking'></i> <br><b>" + get_walking_time(journey_response) + " mins</b></div>" +
                    "<div id = 'wide'><i id='estimate-bus-icon' class='fas fa-bus'></i> <br><b> " + (response.JourneyTime / 60).toFixed(0) + " mins</b></div></div>" +
                    "<div id='parenttwo'><div id='narrowtwo'><p>Weather Forecast:</p></div><div id ='widetwo'><img id='wicon' src=" + iconurl + ">" + temperature + "<span>&#176;</span></div></div>" +
                    "<div>" + google_or_us(response) + "</div>"
                );

            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})
