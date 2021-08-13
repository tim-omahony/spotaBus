function analytics_display(array) {
    const response_array = array
    let analytics_display = '<div>';

    //for each loop iterates over the AJAX response and retrieves the relevant elements at each step
    response_array.forEach(function (step) {
        if (step.transit_type == "TRANSIT" && "analytics" in step) {
            analytics_display +=
                `<h3>Route: ${step.route}</h3>` +
                `<p>Average Dwell Time: ${step.analytics.average_dwell_time['value'].toFixed(0)} secs</p>` +
                `<p>Full Route average journey time : ${(step.analytics.line_average_journey_duration['value'] / 60).toFixed(0)} mins</p>` +
                charts(step) +
                `<p>Average stop-to-stop time: ${step.analytics.stops_travel_time_description.mean.toFixed(0)} secs</p>`;
        } else if (step.transit_type == "TRANSIT" && !("analytics" in step)) {
            analytics_display +=
                `<h3>Route: ${step.route}</h3>` +
                `<p>It looks like we don't have any analytics on the line you chose, come back later to see our updated analytics</p>`;
        }
    });

    //calling the get_arrival_time function to display the arrival time dynamically.
    analytics_display += '</div>';

    // Add the timeline to the page
    return analytics_display;
}


function charts(step) {
    google.charts.load("current", {packages: ["corechart"]});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var late = parseInt((step.analytics.on_time_percentage['Late'] * 100).toFixed(0))
        console.log('late', late)
        var early = parseInt((step.analytics.on_time_percentage['Early'] * 100).toFixed(0))
        console.log('early', early)
        var on_time = parseInt((step.analytics.on_time_percentage['On_time'] * 100).toFixed(0))
        console.log('on time', on_time)

        var data = google.visualization.arrayToDataTable([
            ['Status', 'percentage'],
            ['On time', on_time],
            ['Late', late],
            ['Early', early],

        ]);

        var options = {
            title: 'Arrival Stats',
            pieHole: 0.4,
        };

        var chart = new google.visualization.PieChart(document.getElementById('analytics-output'));
        chart.draw(data, options);
    }
}