function formattedDate() {
    // gets current date and converts it to the google calendar API format (YYYY-MM-DD)
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const today = year + '-' + month + '-' + day;
    console.log('formatted date is ' + today);
    return today;
}

function publicHolidayChecker() {
    //Fetches Google Calendar API public holiday list and then checks if current date is contained in list, if so displays a div above map to user informing them of transport schedule changes
    fetch('https://www.googleapis.com/calendar/v3/calendars/en.irish%23holiday%40group.v.calendar.google.com/events?key=AIzaSyBpmxEf_9hpbApu3UhIu8jY41LDdgPFkqc').then((response) => {
        if (response.ok) {
            console.log('public holiday json retrieved successfully');
            return response.json();
        } else {
            throw new Error('Something went wrong');
        }
    })
        .then((responseJson) => {
            // Do something with the response
            const holidays = [];

            for (let i = 0; i < responseJson.items.length; i++) {
                holidays.push([responseJson.items[i].start.date, responseJson.items[i].summary]);
            }

            console.log(holidays);

            for (let item of holidays) {
                if (item[0] === formattedDate()) {

                    document.getElementById("holidayWidget").innerHTML = "Please be advised today is`" + item[1] + ", bus schedules may be affected.";
                    document.getElementById("holidayWidget").style.visibility = "visible";
                    break;
                }
            }


        })
        .catch((error) => {
            console.log(error)
        });
}


publicHolidayChecker();
