let temp;
let humidity;
let wind_speed;
let weather_main;
let date_time;
let Forecast_weather;
let Current_weather;
let icon;

// function to retrieve the 5 day forecast from openweatherapi
function getForecast() {
    weatherForecast = ($.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=53.344&lon=-6.2672&appid=37038b4337b3dbf599fe6b12dad969bd"))
        .then(response => {
            forecast_weather_array = [];

            const interval = response.list.length;

            //for loop iterates over the response and creates an array with all of the relevant weather details
            for (let y = 0; y < interval; y++) {
                const weather_dict = {};
                date_time = [];
                temp = [];
                humidity = [];
                wind_speed = [];
                weather_main = [];
                icon = [];

                date_time = response.list[y].dt;
                temp = response.list[y].main.temp;
                humidity = response.list[y].main.humidity;
                wind_speed = response.list[y].wind.speed;
                weather_main = response.list[y].weather[0].main;
                icon = response.list[y].weather[0].icon;

                weather_dict['date_time'] = date_time;
                weather_dict['temp'] = temp;
                weather_dict['humidity'] = humidity;
                weather_dict['wind_speed'] = wind_speed;
                weather_dict['weather_main'] = weather_main;
                weather_dict['icon'] = icon;

                forecast_weather_array.push(weather_dict);
            }

            //JSON response for views.py
            Forecast_weather = JSON.stringify(forecast_weather_array);

        })
        .catch(err => {
            console.log(err);
            swal("Error!", "It seems we're having some technical difficulties, please refresh and try again.", "error");
        });
}


// function to retrieve the current weather forecast from openweatherapi
function getWeather() {
    currentWeather = ($.getJSON("https://api.openweathermap.org/data/2.5/weather?lat=53.344&lon=-6.2672&appid=37038b4337b3dbf599fe6b12dad969bd"))
        .then(response => {
            current_weather_array = [];
            const weather_dict = {};

            //an array of dictionaries is filled with the response of all the relevant weather details
            date_time = [];
            temp = [];
            humidity = [];
            wind_speed = [];
            weather_main = [];
            icon = [];

            date_time = response.dt;
            temp = response.main.temp;
            humidity = response.main.humidity;
            wind_speed = response.wind.speed;
            weather_main = response.weather[0].main;
            icon = response.weather[0].icon;

            weather_dict['date_time'] = date_time;
            weather_dict['temp'] = temp;
            weather_dict['humidity'] = humidity;
            weather_dict['wind_speed'] = wind_speed;
            weather_dict['weather_main'] = weather_main;
            weather_dict['icon'] = icon;

            current_weather_array.push(weather_dict);

            //JSON response for views.py
            Current_weather = JSON.stringify(current_weather_array);

        })
        .catch(err => {
            console.log(err);
            swal("Error!", "It seems we're having some technical difficulties, please refresh and try again.", "error");
        });

}


// function to call the above functions which are then passed to views.py to be merged
function mergeWeather() {
    getForecast();
    getWeather();
}







