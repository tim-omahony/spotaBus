//function to get the current datetime and disable all past dates on the datetime picker
function todays_date() {
    const today = new Date().toISOString();
    [yyyy, mm, dd, hh, mi] = today.split(/[/:\-T]/)
    var mindate = document.getElementById("predictTime");
    mindate.setAttribute("min", `${yyyy}-${mm}-${dd}T${hh}:${mi}`);
}

//function to take the user input from the date picker to be passed to the google directions service API
function getDateTime() {
    const regDate = document.getElementById("predictTime").value;
    console.log(regDate);
    unixdate = Date.parse(regDate);

    if (unixdate < Date.now()) {
        date_picked = Date.now();
    } else {
        date_picked = unixdate;
    }
    console.log(unixdate);

    return date_picked;
}
