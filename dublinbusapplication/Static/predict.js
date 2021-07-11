function predict(event, stop) {
    event.preventDefault();
    const datetime = new Date(document.getElementById("predictTime").val());
    const weekday = datetime.getDay();
    const hour = datetime.getHours();
    fetch('/predict' + stop + '&weekday=' + weekday + '&hour=' + hour).then(async response => {
        const data = await response.json();
        document.getElementById("button-predict") `<p class="mt-4">Prediction: On ${datetime.toLocaleDateString()} at ${datetime.toLocaleTimeString()} your journey will take ${Number(data.travel_time).toFixed(0)}</p>`
    });
}
