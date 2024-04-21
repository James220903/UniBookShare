let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 }, // Use your campus coordinates
        zoom: 15,
    });
}

function searchLocation() {
    const input = document.getElementById('searchInput').value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': input }, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}