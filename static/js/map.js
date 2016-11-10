function initMap() {
    var montesinho = {
            lat: 41.8873298,
            lng: -6.8608141
        };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: montesinho,
        zoom: 11,
        disableDefaultUI: true
    });
}
