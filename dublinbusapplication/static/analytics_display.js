function analyticsDisplay(array) {
    const response_array = array
    let i = 0;
    const toAdd = document.createDocumentFragment();
    //for each loop iterates over the AJAX response and retrieves the relevant elements at each step
    response_array.forEach(function (step) {

        const newDiv = document.createElement('div');
        newDiv.id = 'r' + i;
        const map_id = 'r' + i + 1;

        let iterative_response = '<div = "iterative-stats-output">';
        if (step.transit_type === "TRANSIT" && "analytics" in step) {
            var late = parseInt((step.analytics.on_time_percentage['Late'] * 100).toFixed(0))
            var early = parseInt((step.analytics.on_time_percentage['Early'] * 100).toFixed(0))
            var on_time = parseInt((step.analytics.on_time_percentage['On_time'] * 100).toFixed(0))
            charts(late, early, on_time, map_id)
            iterative_response +=
                `<h6><b>Route: ${step.route}</b></h6>` +
                `<p>Average Time in bay: <b>${step.analytics.average_dwell_time['value'].toFixed(0)}</b> secs</p>` +
                `<p>Average stop-to-stop time: <b>${step.analytics.stops_travel_time_description.mean.toFixed(0)}</b> secs</p>` +
                '<div id = "' + map_id + '"></div>';

        } else if (step.transit_type === "TRANSIT" && !("analytics" in step)) {
            iterative_response +=
                `<h6><b>Route: ${step.route}</b></h6>` +
                `<p>It looks like we don't have any analytics on the line you chose, come back later to see our updated analytics!</p></div>`;
        }
        newDiv.innerHTML = iterative_response
        toAdd.appendChild(newDiv)
        i++;
    });

    /*    //calling the getArrivalTime function to display the arrival time dynamically.
        analytics_display += '</div>';*/

    // Add the timeline to the page
    return toAdd;
}


function charts(late, early, on_time, map_id) {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = google.visualization.arrayToDataTable([
            ['header', 'header'],
            ['On time', on_time],
            ['Late', late],
            ['Early', early],
        ]);

        var options = {

            title: 'Arrival Stats',
            chartArea: {
                // leave room for y-axis labels
                width: '94%'
            },
            pieHole: 0.4,
            legend: {position: 'labeled', textStyle: {color: '#222222', fontSize: '3rem'}},
            backgroundColor: 'transparent',
            pieSliceTextStyle: {fontSize: 12},
            titleTextStyle: {color: '#222222', alignment: 'center', fontSize: 15},
            colors: ['#f39c12', '#757575', '#c2c2c2'],
        };
        var chart = new google.visualization.PieChart(document.getElementById(map_id));

        chart.draw(data, options);

        window.addEventListener('resize', function () {
            chart.draw(data, options);
        }, false);

    }
}
