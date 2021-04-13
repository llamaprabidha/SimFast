let map, 
    trailEnabled = true;
    simSpeed = 1,
    flights = [],
    planeSvg = {
        path: 'M 50,5 95,97.5 5,97.5 z',
        fillColor: '#f00',
        fillOpacity: 1.5,
        strokeWeight: 0,
        scale: 0.2,
        anchor: null, // google.maps isn't imported yet, so this can't be set yet
        ax: 50, // x value to set the anchor to later
        ay: 20, // y value to set the anchor to later
    };
   /*
    // This is an actual plane icon from the original code I was using
    // anchor needs to be set to new google.maps.Point(11, 11) in initMap()
    planeSvg = {
        path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z',
        fillColor: '#000',
        fillOpacity: 1.5,
        scale: 0.1,
        anchor: null,
        strokeWeight: 0,
   };*/

// Parameters that control the map
const params = {
    draggable: false,
    panControl: false,
    scrollWheel: false,
    scaleControl: false,
    disableDefaultUI: true,
    streetViewControl: false,
    disableDoubleClickZoom: true,
    center: { lat: 40.4526, lng: -74.4652 },
    zoom: 9,
    styles: [{
        "featureType": "administrative",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "poi",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "water",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "transit",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "landscape",
        "stylers": [{
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road.highway",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road.local",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "visibility": "on"
        }]
    }, {
        "featureType": "water",
        "stylers": [{
            "color": "#84afa3"
        }, {
            "lightness": 52
        }]
    }, {
        "stylers": [{
            "saturation": -17
        }, {
            "gamma": 0.36
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "color": "#3f518c"
        }]
    }]
};

// Call this function to start the animation from location1 to location2
const animate = (flight) => {
    // removeTrail();

    let start = new google.maps.LatLng(flight.origin.lat, flight.origin.long);
    let end = new google.maps.LatLng(flight.destination.lat, flight.destination.long);

    flight.planePath = new google.maps.Polyline({
        path: [start, end],
        strokeColor: '#0f0', // ?
        strokeWeight: 0,
        map: map,
        geodesic: true,
        icons: [{
            icon: planeSvg,
            offset: '0%'
        }],
        label: 'test'
    });

    flight.trailPath = new google.maps.Polyline({
        path: [start, start],
        strokeColor: '#f00', // ?
        strokeWeight: 1,
        map: map,
        geodesic: true
    });

    console.log('Running flight ' + flight.aircraftId + ' from ' + flight.origin.name + ' to ' + flight.destination.name);
    console.log('Total distance: ' + (google.maps.geometry.spherical.computeDistanceBetween(start, end) / 1000) + ' km');

    animationLoop = window.requestAnimationFrame(() => tick(start, end, knotsToMps(flight.groundspeed), 
        flight.planePath, flight.trailPath, flight.animationLoop, flight.animationIndex));
};

const tick = (start, end, groundspeed, planePath, trailPath, animationLoop, animationIndex) => {

    let distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
    animationIndex += groundspeed / distance * simSpeed * 20;

    let next = google.maps.geometry.spherical.interpolate(start, end, animationIndex / 100);
 
    planePath.icons[0].offset = Math.min(animationIndex, 100) + '%';
    planePath.setPath(planePath.getPath());
    trailPath.setPath([start, next]);
    
    
    if (!trailEnabled) {
        trailPath.setMap(null);
    } else if (trailPath.getMap() == null) {
        trailPath.setMap(map);
    }

    // map.panTo(next);

    if (animationIndex >= 100) {
        window.cancelAnimationFrame(animationLoop);
        animationIndex = 0;
        removePlane(planePath, trailPath, animationLoop);
        setTimeout(()=>{}, 700);
        stopTimer();
    } else {
        animationLoop = window.requestAnimationFrame(() => tick(start, end, groundspeed, planePath, trailPath, animationLoop, animationIndex));
    }

};

const removePlane = (planePath, trailPath, animationLoop) => {
    removeTrail(trailPath);
    if (planePath) {
        planePath.setMap(null);
    }
    window.cancelAnimationFrame(animationLoop);
    animationIndex = 0;
};

const removeTrail = trailPath => {
    if (trailPath) {
        trailPath.setMap(null);
    }
};

const knotsToMps = knots => knots * 0.514444;

const start = () => { 
    animate(flights[0]);
    setTimeout(animate(flights[1]), 10000);
};

// Callback for the Google Maps import
async function initMap() {
    map = new google.maps.Map(document.getElementById("map"), params);
    planeSvg.anchor = new google.maps.Point(planeSvg.ax, planeSvg.ay); // ?

    // Load in locations from JSON
    await fetch('flights.json')
        .then(res => res.json())
        .then(res => {
            res.forEach(e => {
                e.planePath = null;
                e.trailPath = null;
                e.animationIndex = 0;
                e.animationLoop = false;
            });
            return res;
        })
        .then(res => flights = res);
    
    console.log(flights);
}