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
                    'journey_steps_response': result.journey_steps_response,
                    'JourneyTime': result.JourneyTime,
                    'Weather': result.Weather,
                    'prediction_type': result.prediction_type,
                };


                const iconurl = "http://openweathermap.org/img/wn/" + response.Weather.icon + "@2x.png";
                var temperature = (response.Weather.temp - 273).toFixed(1);
                console.log(response.journey_steps_response)
                var journey_response = response.journey_steps_response

                $('#output').html("<p>" + results_display(journey_response) + "</p>" +
                    "<div>"+google_or_us(response)+"<p>Estimated Bus Journey Time: " + (response.JourneyTime/60).toFixed(0) + " minutes</p>" +
                    " </div><div id='icon'><p>Weather Forecast:</p><p>" + temperature + "<span>&#176;</span><img id='wicon' src=" + iconurl + "></p></div>"
                );

            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})


