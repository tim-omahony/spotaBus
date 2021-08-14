async function selectFavourite() {
    const orig = document.getElementById('origin-input').value
    const dest = document.getElementById('destination-input').value
    fetch("/google_api/", {
        "method": "POST",
        "headers": {credentials: 'same-origin', "X-CSRFToken": getCookie('csrftoken')},
        body: JSON.stringify({
            origin_stop: orig, destination_stop: dest
        })
    })
        .then(response => {
            response.json().then(json => console.log({json}))
        })
        .catch(err => {
            console.error(err);
        });

}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
