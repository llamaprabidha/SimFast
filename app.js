let map,
  trailEnabled = false,
  pauseState = false,
  simSpeed = 1,
  flights = [],
  activeFlights = [],
  planeSvg = {
    // path: 'M 50,5 95,97.5 5,97.5 z',
    fillColor: '#fff',
    fillOpacity: 1.5,
    strokeWeight: 0,
    scale: 0.15,
    anchor: null, // google.maps isn't imported yet, so this can't be set yet
    ax: 50, // x value to set the anchor to later
    ay: 20, // y value to set the anchor to later
  },
  Popup;
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
  panControl: false,
  scrollWheel: false,
  scaleControl: false,
  disableDefaultUI: true,
  gestureHandling: 'none',
  streetViewControl: false,
  disableDoubleClickZoom: true,
  center: { lat: 40.4526, lng: -74.4652 },
  zoom: 9,
  styles: [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]
};

// Call this function to start the animation from location1 to location2
const animate = flight => {

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
    strokeColor: '#fff',
    strokeWeight: 1,
    map: map,
    geodesic: true
  });
  flight.trailPath.setMap(map);

  flight.dataBlock = new Popup(start, createDataBlock(flight));
  flight.dataBlock.setMap(map);

  activeFlights.push(flight);

  console.log('Running flight ' + flight.aircraftId + ' from ' + flight.origin.name + ' to ' + flight.destination.name);
  console.log('Total distance: ' + (google.maps.geometry.spherical.computeDistanceBetween(start, end) / 1000) + ' km');

  flight.animationLoop = window.requestAnimationFrame(() => tick(flight));
};

const tick = flight => {

  let start = new google.maps.LatLng(flight.origin.lat, flight.origin.long);
  let end = new google.maps.LatLng(flight.destination.lat, flight.destination.long);

  let distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
  flight.animationIndex += knotsToMps(flight.groundspeed) / distance * simSpeed * 20;
  let next = google.maps.geometry.spherical.interpolate(start, end, flight.animationIndex / 100);

  flight.planePath.icons[0].offset = Math.min(flight.animationIndex, 100) + '%';
  flight.planePath.setPath(flight.planePath.getPath());
  flight.trailPath.setPath([start, next]);

  if (!trailEnabled) {
    flight.trailPath.setMap(null);
  } else if (flight.trailPath.getMap() == null) {
    flight.trailPath.setMap(map);
  }

  flight.dataBlock.position = next;
  flight.dataBlock.draw();

  switch (getDataBlockCycle()) {
    case 0:
      flight.dataBlock.containerDiv.children[0].children[0].innerHTML = getDataBlockString(flight, 0);
      break;
    case 1:
      flight.dataBlock.containerDiv.children[0].children[0].innerHTML = getDataBlockString(flight, 1);
      break;
  }

  if (flight.animationIndex >= 100) {
    removePlane(flight);
    // setTimeout(()=>{}, 700);
    // stopTimer();
  } else {
    flight.animationLoop = window.requestAnimationFrame(() => tick(flight));
  }

};

const removePlane = flight => {

  activeFlights.splice(activeFlights.indexOf(flight), 1);

  flight?.planePath?.setMap(null);
  flight?.trailPath?.setMap(null);
  flight?.dataBlock?.setMap(null);

  window.cancelAnimationFrame(flight.animationLoop);
  flight.animationIndex = 0;

  // Check if last plane to stop timer
  if (activeFlights.length == 0) {
    // stopTimer();
  }

};

const knotsToMps = knots => knots * 0.514444;

// Times with seconds ending in 0-4 return 0; times with seconds ending in 5-9 return 1
const getDataBlockCycle = () => Math.ceil(new Date().getSeconds() / 5) % 2;

const createDataBlock = flight => {
  // Temp
  let div = document.createElement('div');
  div.innerHTML = getDataBlockString(flight, 0);
  return div;
};

const getDataBlockString = (flight, cycle) => {
  let data;
  switch (cycle) {
    case 0:
      data = flight.aircraftId + '<br>' + (flight.altitude / 100) + '  ' + flight.groundspeed + 'PF';
      break;
    case 1:
      data = flight.aircraftId + '<br>' + flight.destination.name + '  ' + flight.aircraftType;
      break;
  }
  return data;
};

const play = () => {
  if (activeFlights.length == 0) {
    // Starting
    startTimer();
    // move();
    animate(flights[0]);
    setTimeout(animate(flights[1]), 10000);

  } else {
    pause(false);
  }
};

const pause = (state) => {
  if (state) {
    simSpeed = 0;
    stopTimer();
    pauseState = true;
  }
  else {
    changeSpeed();
    startTimer();
    pauseState = false
  }
};

const reset = () => {
  [...activeFlights].forEach(e => removePlane(e));
  pause(false);
  resetTimer();
}

const changeSpeed = () => {
  let speed = document.getElementById("selectedSpeed").value;
  if (!isNaN(speed)) {
    simSpeed = speed;
  } else {
    // for safety
    simSpeed = 1;
  }
};

// Callback for the Google Maps import
async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), params);
  planeSvg.anchor = new google.maps.Point(planeSvg.ax, planeSvg.ay); // ?

  /**
   * A customized popup on the map.
   */
  Popup = class Popup extends google.maps.OverlayView {
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");
      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      if (this.getProjection()?.fromLatLngToDivPixel(this.position)) {
        const divPosition = this.getProjection()?.fromLatLngToDivPixel(
          this.position
        );
        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      }
    }
  }

  // Load in locations from JSON
  await fetch('flights.json')
    .then(res => res.json())
    .then(res => {
      res.forEach(e => {
        e.planePath = null;
        e.trailPath = null;
        e.animationIndex = 0;
        e.animationLoop = false;
        e.dataBlock = null;
      });
      return res;
    })
    .then(res => flights = res);

  console.log(flights);
}