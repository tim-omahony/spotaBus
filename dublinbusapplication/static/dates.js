//function to get the current datetime and disable all past dates on the datetime picker
function todays_date() {
    //variable created with todays date
    const today = new Date().toISOString();

    //today variable is converted into it's seperate components
    [yyyy, mm, dd, hh, mi] = today.split(/[/:\-T]/)

    //components from above are used to set the min attribute of the datetime picker as the current date and time
    const mindate = document.getElementById("predictTime");
    mindate.setAttribute("min", `${yyyy}-${mm}-${dd}T${hh}:${mi}`);
}

//function to take the user input from the date picker to be passed to the google directions service API
//takes the date inputted by the user and converts it to UNIX format (called in autocomplete.js)
function getDateTime() {
    const regDate = document.getElementById("predictTime").value;
    unixdate = Date.parse(regDate);
    return unixdate;
}
