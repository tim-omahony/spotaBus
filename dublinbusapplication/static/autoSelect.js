async function selectFavourite() {
    const orig = document.getElementById('origin-input').value
    const origURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${JSON.stringify(orig)}&inputtype=textquery&fields=formatted_address&key=AIzaSyBpmxEf_9hpbApu3UhIu8jY41LDdgPFkqc`
    console.log({origURL})
    const dest = document.getElementById('destination-input').value
    const destURL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${JSON.stringify(dest)}&inputtype=textquery&fields=formatted_address&key=AIzaSyBpmxEf_9hpbApu3UhIu8jY41LDdgPFkqc`
    console.log({destURL})
    fetch(
        origURL,
        {method: 'GET', mode: 'no-cors'}
    ).then(res => res.text().then(text => console.log(text)));
    fetch(
        destURL,
        {method: 'GET', mode: 'no-cors'}
    ).then(res => res.text().then(text => console.log(text)));
}