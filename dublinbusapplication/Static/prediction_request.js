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

                    route: RouteShortname,
                    hour: inputTime.getHours(),
                    day: inputTime.getDay(),
                    month: inputTime.getMonth(),
                    temp: currentWeather.responseJSON.main.temp,
                    wind_speed: currentWeather.responseJSON.wind.speed,
                    humidity: currentWeather.responseJSON.main.humidity,
                    weather_main: currentWeather.responseJSON.weather[0].main,
                    steps_array: Journey_Steps,
                    csrfmiddlewaretoken,
                    dataType: "json",
                },

            // if the function properly sends data to the predictive model the estimated travel time is returned
            success: function (result) {
                console.log(result)
                $('#output').html("<p>Estimated Bus Journey Time: " + result + " minutes</p>");
            },

            failure: function (result) {
                console.log(result)
            }
        })
    });
})
