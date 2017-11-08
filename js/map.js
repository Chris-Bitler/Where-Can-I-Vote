/**
 * These functions were taken from an example that google provided for the javascript maps API
 * and moderately modified to work for this specific use case
 * @author Christopher Bitler
 */

/**
 * Create the map in the element with the ID 'map'
 * @param address The user's address
 * @param pollingLocation The polling location of the user (address)
 * @param latlng The latitude/longitude for the user's address
 */
function initMap(address, pollingLocation, latlng) {
    var markerArray = [];

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: latlng.lat, lng: latlng.lng}
    });

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;

    calculateAndDisplayRoute(
            address, pollingLocation, directionsDisplay, directionsService, markerArray, stepDisplay, map);

    $("#response").css("display", "block");

}

/**
 * Use google's DirectionsService to generate a list of steps in the route
 * from the user's address to the voting center
 *
 * @param address Address of the user
 * @param pollingLocation Address of the polling center
 * @param directionsDisplay Google Maps Direction Renderer
 * @param directionsService Google Maps Direction Service
 * @param markerArray Blank array to store the markers on the map
 * @param stepDisplay Info window to hold the instructions at a given marker
 * @param map The google maps 'Map' object
 */
function calculateAndDisplayRoute(address, pollingLocation, directionsDisplay, directionsService,
                                  markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    address = decodeURIComponent(address);
    // Retrieve the start and end locations and create a DirectionsRequest using
    // Driving directions.
    directionsService.route({
        origin: address,
        destination: pollingLocation,
        travelMode: 'DRIVING'
    }, function(response, status) {
        // Route the directions and pass the response to a function to create
        // markers for each step.
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

/**
 * Create the markers on the map to show the direction steps
 * @param directionResult The directionsService.route() response
 * @param markerArray The array of markers
 * @param stepDisplay The instructions display for the markers
 * @param map The map object
 */
function showSteps(directionResult, markerArray, stepDisplay, map) {
    // For each step, place a marker, and add the text to the marker's infowindow.
    // Also attach the marker to an array so we can keep track of it and remove it
    // when calculating new routes.
    var myRoute = directionResult.routes[0].legs[0];
    for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(
            stepDisplay, marker, myRoute.steps[i].instructions, map);
    }
}

/**
 * Show the marker with the directions at the marker when you click on it
 * @param stepDisplay The info window
 * @param marker The map marker
 * @param text The text to show at that marker
 * @param map The map object
 */
function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
        // Open an info window when the marker is clicked on, containing the text
        // of the step.
        stepDisplay.setContent(text);
        stepDisplay.open(map, marker);
    });
}

/**
 * Use the google map's geocoding API to turn the user's normalized address into
 * a pair of latitude and longitude coordinates, then start rendering the map
 * @param address The user's address
 * @param pollingLocation The address of the polling location
 */
function getLatLngForAddressAndInitMap(address, pollingLocation) {
    address = encodeURIComponent(address);
    $.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + MAPS_API_KEY, function (data) {
        var location = data.results[0];
        var latlng = {
            lat: location.geometry.location.lat,
            lng: location.geometry.location.lng
        };
        initMap(address, pollingLocation, latlng);
    });
}
