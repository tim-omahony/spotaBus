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
                    'JourneyTime': result.JourneyTime,
                    'Weather': result.Weather,
                    'prediction_type': result.prediction_type,
                };

                const iconurl = "http://openweathermap.org/img/wn/" + response.Weather.icon + "@2x.png";
                const temperature = (response.Weather.temp - 273).toFixed(1);
                $('#output').html("<p>" + results_display(Journey_Steps) + "</p>" +
                    "<div>" + google_or_us(response) + "<p>Estimated Bus Journey Time: " + response.JourneyTime + " minutes</p>" +
                    " </div><div id='icon'><p>Weather Forecast:</p><p>" + temperature + "<span>&#176;</span><img id='wicon' src=" + iconurl + "></p></div>"
                );

            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})
