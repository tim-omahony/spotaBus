function predict(event, stop) {
    event.preventDefault();
    const datetime = new Date($('#predictTime').val());
    const weekday = datetime.getDay();
    const hour = datetime.getHours();
    fetch('/predict?route=' + stop + '&weekday=' + weekday + '&hour=' + hour).then(async response => {
        const data = await response.json();
        $('#stopModalPrediction').html(`<p class="mt-4">Prediction: On ${datetime.toLocaleDateString()} at ${datetime.toLocaleTimeString()} your journey will take ${Number(data.travel_time).toFixed(0)}</p>`);
    });
}