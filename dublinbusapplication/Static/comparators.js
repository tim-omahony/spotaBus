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
