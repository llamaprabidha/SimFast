let map,
  trailEnabled = false,
  pauseState = false,
  simSpeed = 1,
  flights = [],
  activeFlights = [],
  offScreenFlights = [], // flights that are not visible yet
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
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
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

  flight.dataBlock = new Popup(start, createDataBlock(flight), flight);
  flight.dataBlock.setMap(map);

  activeFlights.push(flight);
  offScreenFlights.push(flight);

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
    reset();
  }

};

const knotsToMps = knots => knots * 0.514444;

// Times with seconds ending in 0-4 return 0; times with seconds ending in 5-9 return 1
const getDataBlockCycle = () => Math.ceil(new Date().getSeconds() / 5) % 2;

const createDataBlock = flight => {
  let div = document.createElement('div');
  div.innerHTML = getDataBlockString(flight, getDataBlockString());
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

const loadFlights = async path => {
  flights = [];
  await fetch(path)
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
}

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
  offScreenFlights = [];
  pause(false);
  resetTimer();
  loadFlights('flights.json');
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
  planeSvg.anchor = new google.maps.Point(planeSvg.ax, planeSvg.ay);

  /**
   * A customized popup on the map.
   */
  Popup = class Popup extends google.maps.OverlayView {
    constructor(position, content, flight) {
      super();
      this.position = position;
      this.flight = flight;
      this.onScreen = false;
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

        let onScreen = map.getBounds().contains(this.position);

        if (!this.onScreen && onScreen) {
          this.onScreen = true;
          offScreenFlights.splice(offScreenFlights.indexOf(this.flight), 1);
        } else if (this.onScreen && !onScreen) {
          // If the flight needs to reappear in the offscreen list if/when it goes off screen again
          this.onScreen = false;
          offScreenFlights.push(this.fight);
        }

      }
    }
  }

  // Load in locations from JSON
  await loadFlights('flights.json');

  console.log(flights);
}