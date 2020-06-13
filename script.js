let map, infoWindow, autocomplete;
let newLocation = [];
let nodeList = [
    {
        name: 'Location Name 1',
        lat: 43.869580,
        lng: -79.361680,
        type: 'product'
    },
    {
        name: 'Place 2',
        lat: 43.849899,
        lng: -79.367287,
        type: 'restroom'
    },
    {
        name: 'Place 3',
        lat: 43.850940,
        lng: -79.357210,
        type: 'product'
    },
    {
        name: 'Place 4',
        lat: 43.864720,
        lng: -79.343400,
        type: 'restroom'
    },
    {
        name: 'Place 5',
        lat: 43.8679465152648,
        lng: -79.3432037,
        type: 'restroom'
    }
];
let markerList = [];
let infoList = [];

// Creating autocomplete object
window.onload = function () {
    let input = document.getElementById('autocomplete');
    autocomplete = new google.maps.places.Autocomplete(input);

    // For add.html
    if (window.location.pathname === '/add.html') {
        let nodeType = Array.from(document.querySelectorAll(".node-btn"));

        for (let i = 0; i < nodeType.length; i++) {
            nodeType[i].addEventListener("click", function () {
                nodeType[i].classList.toggle("active");
                nodeType[i].classList.toggle("btn-outline-primary");
                nodeType[i].classList.toggle("btn-primary");
            });
        }
    } else {
        this.initMap();
    }

    // Retrieve nodeList from local storage
    if (localStorage.getItem('locationArray')) {
        nodeList = JSON.parse(localStorage.getItem('locationArray'));
    }
};

// Creating map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow;

    // Perform geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);

            // Create marker
            let marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(pos.lat, pos.lng),
                title: 'User location'
            });

            // Add circle overlay + bind to marker + set bounds for autocomplete
            let circle = new google.maps.Circle({
                map: map,
                radius: 1000,
                fillColor: '#ADCFF1',
                fillOpacity: 0.2,
                strokeOpacity: 0
            });
            circle.bindTo('center', marker, 'position');

            // Creating markers for nodes
            for (let i = 0; i < nodeList.length; i++) {
                let newMarker;
                if (nodeList[i].type === 'product') {
                    newMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(nodeList[i].lat, nodeList[i].lng),
                        map: map,
                        title: nodeList[i].name,
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });
                } else {
                    newMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(nodeList[i].lat, nodeList[i].lng),
                        map: map,
                        title: nodeList[i].name,
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });
                }
                let newInfoList = new google.maps.InfoWindow({
                    content: nodeList[i].name
                });
                newMarker.addListener('click', function () {
                    newInfoList.open(map, newMarker);
                });
                markerList.push(newMarker);
                infoList.push(newInfoList);
            }
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // If browser doesn't support geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(hasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(hasGeolocation ? 'Error: geolocation service failed.' : 'Error: browser does not support geolocation.');
    infoWindow.open(map);
}

// Adding new location
function addLocation() {
    newLocation = document.getElementById('add-location').value.split(" ");
    if (document.getElementById('product').classList.contains('active')) {
        nodeList.push({
            name: 'New Place',
            lat: parseFloat(newLocation[0]),
            lng: parseFloat(newLocation[1]),
            type: 'product'
        });
    } else {
        nodeList.push({
            name: 'New Place',
            lat: parseFloat(newLocation[0]),
            lng: parseFloat(newLocation[1]),
            type: 'restroom'
        });
    }
    localStorage.setItem('locationArray', JSON.stringify(nodeList));
}