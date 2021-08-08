// function tripCO2Details(distance) {
//
//     const tag = document.createElement("hr");
//     const element = document.getElementById("busCO2Details");
//     element.appendChild(tag);
//
//     const tagP = document.createElement("p");
//     const textP = document.createTextNode("Your selected trip is " + distance + " km long. At 23g CO2 emissions per seat km, your journey would generate " + Math.round(23 * distance) + "g of C02.");
//
//     element.appendChild(textP);
//
// }

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

const lotsOfMins = (mins) => mins / 60 > 1

function drivingComparatorInfoPopulator(duration) {
    //populates information fields for constious journey transit methods
    document.getElementById("drivingTransitTime").innerHTML = Math.round(duration / 60) + ` minute${lotsOfMins(duration) ? 's' : ''}`;
}

function walkingComparatorInfoPopulator(duration) {
    //populates information fields for constious journey transit methods
    document.getElementById("walkingTransitTime").innerHTML = Math.round(duration / 60) + ` minute${lotsOfMins(duration) ? 's' : ''}`;
}

function cyclingComparatorInfoPopulator(duration) {
    //populates information fields for constious journey transit methods
    document.getElementById("cycleTransitTime").innerHTML = Math.round(duration / 60) + ` minute${lotsOfMins(duration) ? 's' : ''}`;
}

function displayTransportComparator() {
    document.getElementById("journeyComparer").style.display = "inline";
    $("#journeyComparer").slideDown();
}
