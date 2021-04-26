let map,
trailEnabled = false,
pauseState = false,
simSpeed = 1,
flights = [],
activeFlights = [],
startTimes = {},
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
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#212121'
        }
      ]
    },
    {
      'elementType': 'labels',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#212121'
        }
      ]
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'administrative.country',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#9e9e9e'
        }
      ]
    },
    {
      'featureType': 'administrative.land_parcel',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'administrative.locality',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#bdbdbd'
        }
      ]
    },
    {
      'featureType': 'administrative.neighborhood',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#181818'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#616161'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#1b1b1b'
        }
      ]
    },
    {
      'featureType': 'road',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#2c2c2c'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#8a8a8a'
        }
      ]
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#373737'
        }
      ]
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#3c3c3c'
        }
      ]
    },
    {
      'featureType': 'road.highway.controlled_access',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#4e4e4e'
        }
      ]
    },
    {
      'featureType': 'road.local',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#616161'
        }
      ]
    },
    {
      'featureType': 'transit',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#757575'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [
        {
          'color': '#000000'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#3d3d3d'
        }
      ]
    }
  ]
},
planeIcon = 'images/v.svg',
lineSymbol = {
  path: 'M 0,1 0,1',
  strokeOpacity: 1,
  scale: 2
};

// Call this function to start the animation from location1 to location2
const animate = flight => {

  let start = flight.animprops.locations[0];

  // Create plane marker
  flight.animprops.icon = new google.maps.Marker({
    position: start,
    icon: {
      url: planeIcon,
      scaledSize: new google.maps.Size(12, 12)
    },
    map: map
  });
  flight.animprops.icon.addListener('click', () => displayFlightStrip(flight));

  // Create plane trail
  flight.animprops.trails[0] = createTrail(start);
  trailEnabled ? {} : flight.animprops.trails[0].setMap(null);

  // Create data block
  flight.animprops.dataBlock = new Popup(start, createDataBlock(flight), flight);
  flight.animprops.dataBlock.setMap(map);

  activeFlights.push(flight);

  // Log flight to console
  console.log('Running flight ' + flight.flightId + ' from ' + flight.origin.name + ' to ' + flight.destination.name);
  console.log('Total distance: ' + (google.maps.geometry.spherical.computeLength(flight.animprops.locations) / 1000) + ' km');

  // Initiate flight loop
  flight.animprops.loop = window.requestAnimationFrame(() => tick(flight));

};

const tick = flight => {

  // Calculate next position
  let location1 = flight.animprops.locations[flight.animprops.nextLocationIndex - 1];
  let location2 = flight.animprops.locations[flight.animprops.nextLocationIndex];
  let distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);

  flight.animprops.progress += knotsToMps(flight.groundspeed) / distance * simSpeed * 20;
  let nextPosition = google.maps.geometry.spherical.interpolate(location1, location2, flight.animprops.progress / 100);

  // Update icon
  flight.animprops.icon.setPosition(nextPosition); // Causes console lag?

  // Update trail
  flight.animprops.trails[flight.animprops.trails.length - 1].setPath([location1, nextPosition]);

  // Update data block
  switch (getDataBlockCycle()) {
    case 0:
      flight.animprops.dataBlock.containerDiv.children[0].children[0].innerHTML = getDataBlockString(flight, 0);
      break;
    case 1:
      flight.animprops.dataBlock.containerDiv.children[0].children[0].innerHTML = getDataBlockString(flight, 1);
      break;
  }

  flight.animprops.dataBlock.position = nextPosition;
  flight.animprops.dataBlock.draw();

  // Check completion
  if (flight.animprops.progress >= 100) {
    if (flight.animprops.nextLocationIndex == flight.animprops.locations.length - 1) {
      removePlane(flight);
    } else {
      flight.animprops.progress = 0;
      flight.animprops.nextLocationIndex++;
      let trail = createTrail(nextPosition);
      flight.animprops.trails.push(trail);
      trailEnabled ? {} : trail.setMap(null);
      flight.animprops.loop = window.requestAnimationFrame(() => tick(flight));
    }
  } else {
    flight.animprops.loop = window.requestAnimationFrame(() => tick(flight));
  }

};

const removePlane = flight => {

  activeFlights.splice(activeFlights.indexOf(flight), 1);
  removeFlightFromFlightsList(flight);

  flight?.animprops?.icon?.setMap(null);
  flight?.animprops?.trails?.forEach(trail => trail?.setMap(null));
  flight?.animprops?.dataBlock?.setMap(null);

  window.cancelAnimationFrame(flight?.animprops?.animationLoop);
  flight.animprops.animationIndex = 0;

  // Check if last plane to stop timer
  if (activeFlights.length == 0) {
    reset();
  }

};

/*
 *
 * UTILITY
 * 
 */

const knotsToMps = knots => knots * 0.514444;

// Creates a 2-second cycle
// Returns 0 when current seconds % 4 = 0 or 1, returns 1 when current seconds % 4 = 2 or 2
const getDataBlockCycle = () => Math.floor(new Date().getSeconds() % 4 / 2);

const secondsToTimeString = seconds => new Date(seconds * 1000).toISOString().substr(11, 8);

const createDataBlock = flight => {
  let div = document.createElement('div');
  div.innerHTML = getDataBlockString(flight, getDataBlockString());
  return div;
};

const getDataBlockString = (flight, cycle) => {
  let data;
  switch (cycle) {
    case 0:
      data = flight.flightId + '<br>' + (flight.altitude / 100) + '  ' + flight.groundspeed + 'PF';
      break;
    case 1:
      data = flight.flightId + '<br>' + flight.destination.name + '  ' + flight.aircraftType;
      break;
  }
  return data;
};

const getFlightsListString = flight => {
  let distance = Math.round(google.maps.geometry.spherical.computeLength(flight.animprops.locations) / 1000) + ' km';
  let distanceDigits = distance.toString().length;
  let distanceSpacing = '';
  switch (distanceDigits) {
    // Out of order for performance benefit...maybe?
    case 3+3:
      distanceSpacing = '&nbsp;&nbsp;';
      break;
    case 4+3:
      distanceSpacing = '&nbsp;';
      break;
    case 2+3:
      distanceSpacing = '&nbsp;&nbsp;&nbsp;';
      break;
    case 1+3:
      distanceSpacing = '&nbsp;&nbsp;&nbsp;&nbsp;';
      break;
    case 5+3:
      break;
    default:
      distanceSpacing = '&nbsp;&nbsp;'; // whatever, we don't care at this point
  }
  let speed = flight.groundspeed + ' kt';
  let speedDigits = speed.toString().length;
  let speedSpacing = '';
  switch (speedDigits) {
    // Out of order for performance benefit...maybe?
    case 3+3:
      speedSpacing = '&nbsp;&nbsp;';
      break;
    case 4+3:
      speedSpacing = '&nbsp;';
      break;
    case 2+3:
      speedSpacing = '&nbsp;&nbsp;&nbsp;';
      break;
    case 1+3:
      speedSpacing = '&nbsp;&nbsp;&nbsp;&nbsp;';
      break;
    case 5+3:
      break;
    default:
      speedSpacing = ''; // whatever, we don't care at this point
  }
  return flight.flightId + '&nbsp;&nbsp;&nbsp;&nbsp;'
        + flight.aircraftType + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
        + distance + '&nbsp;&nbsp;&nbsp;' + distanceSpacing
        + flight.groundspeed + ' kt&nbsp;&nbsp;&nbsp;' + speedSpacing
        + secondsToTimeString(flight.startTime) + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
        + flight.origin.name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
        + flight.destination.name;
};

const initFlights = async path => {
  flights = [];
  await fetch(path)
    .then(response => response.json())
    .then(response => {
      response.forEach(flight => {
        flight.animprops = {};
        flight.animprops.locations = [
          new google.maps.LatLng(flight.origin.lat, flight.origin.long),
          new google.maps.LatLng(flight.destination.lat, flight.destination.long)
        ];
        if (flight?.midpoints) {
          let midpoints = [];
          flight.midpoints.forEach(midpoint => {
            midpoints.push(new google.maps.LatLng(midpoint.lat, midpoint.long));
          });
          flight.animprops.locations.splice(1, 0, ...midpoints);
        }
        flight.animprops.nextLocationIndex = 1;
        flight.animprops.icon = null;
        flight.animprops.trails = [];
        flight.animprops.progress = 0;
        flight.animprops.loop = false;
        flight.animprops.dataBlock = null;
      });
      return response;
    })
    .then(response => flights = response);

    // Set up start times array
    for (let i = 0; i < flights.length; i++) {
      let timeString = secondsToTimeString(flights[i].startTime);
      startTimes[timeString] ? {} : startTimes[timeString] = [];
      startTimes[timeString].push(i);
    }

}

const addMidpoint = (flight, location, index, deleteNext = false) => {
  if (index == flight.animprops.nextLocationIndex) {
    let current = flight.animprops.dataBlock.position;
    let trail = createTrail(location);
    flight.animprops.locations.splice(index, 0, ...[current, location]);
    deleteNext ? flight.animprops.locations.splice(flight.animprops.nextLocationIndex + 2, 1) : {};
    flight.animprops.trails.push(trail);
    trailEnabled ? {} : trail.setMap(null);
    flight.animprops.nextLocationIndex++;
    flight.animprops.progress = 0;
  } else if (index < flights.animprops.nextLocationIndex && index < flights.animprops.locations.length) {
    flight.animprops.locations.splice(index, 0, location);
  }
};

const createTrail = location => {
  return new google.maps.Polyline({
    path: [location, location],
    strokeColor: '#fff',
    strokeWeight: 0,
    map: map,
    geodesic: true,
    icons: [
      {
        icon: lineSymbol,
        offset: '0',
        repeat: '5px'
      }
    ]
  });
};


/*
 *
 * FLIGHT BOX & FLIGHT STRIPS
 * 
 */ 

const initFlightsList = () => {
  let flightsList = document.getElementById('flights');
  let numFlights = flightsList.options.length;
  for (let i = 0; i < numFlights - 1; i++) {
    flightsList.remove(1);
  }
  flights.forEach(flight => addFlightToFlightsList(flight));
};

const addFlightToFlightsList = flight => {
  let option = document.createElement('option');
  option.id = flight.flightId;
  option.innerHTML = getFlightsListString(flight);
  option.onclick = () => {
    displayFlightStrip(flight);
  };
  document.getElementById('flights').add(option);
};

const removeFlightFromFlightsList = flight => document.getElementById(flight.flightId)?.remove();

const displayFlightStrip = flight => {
  let flightStripContainer = document.getElementById('image-container');
  if (flight) {
    let flightStripImage = document.createElement('img');
    flightStripImage.src = 'images/' + flight?.flightId + '.jpg';
    flightStripContainer.innerHTML = '';
    flightStripContainer.appendChild(flightStripImage);
  } else {
    flightStripContainer.innerHTML = '';
  }
};

/*
 *
 * KEYBOARD COMMANDS
 * 
 */

const updateFlightOnFlightsList = flight => {
  let option = document.getElementById(flight.flightId);
  option?.innerHTML ? option.innerHTML = getFlightsListString(flight) : {};
}

const changeFlightSpeed = (flight, speed) => {
  flight.groundspeed = speed;
  updateFlightOnFlightsList(flight);
}

const changeFlightAltitude = (flight, altitude) => flight.altitude = altitude;

// Travels in the new direction the remaining distance to the original next location 
const changeFlightHeading = (flight, direction) => {
  let currentPosition = flight.animprops.dataBlock.position;
  let nextLocationIndex = flight.animprops.nextLocationIndex;
  let distanceRemaining = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, flight.animprops.locations[nextLocationIndex]);
  let newPosition = google.maps.geometry.spherical.computeOffset(currentPosition, distanceRemaining, direction);
  addMidpoint(flight, newPosition, nextLocationIndex, true);
};

const parseCommand = command => {

  let parts = command.split(/(\s+)/).filter( e => e.trim().length > 0);
  
  switch(parts?.[0]) {
    case 'H':
    case 'HEADING':
      let heading = parseInt(parts?.[1]);
      if (!isNaN(heading) && parts?.[2]) {
        let flight = activeFlights.find(flight => flight.flightId == parts[2]);
        if (flight) {
          changeFlightHeading(flight, heading);
        }
      }
      break;
    case 'A':
    case 'ALTITUDE':
      let altitude = parseInt(parts?.[1]);
      if (!isNaN(altitude) && parts?.[2]) {
        let flight = activeFlights.find(flight => flight.flightId == parts[2]);
        if (flight) {
          changeFlightAltitude(flight, altitude);
        }
      }
      break;
    case 'S':
    case 'SPEED':
      let speed = parseInt(parts?.[1]);
      if (!isNaN(speed) && parts?.[2]) {
        let flight = activeFlights.find(flight => flight.flightId == parts[2]);
        if (flight) {
          changeFlightSpeed(flight, speed);
        }
      }
      break;
    case 'TRAILENABLED':
      switch (parts?.[1]) {
        case 'TRUE':
          toggleTrail(true);
          break;
        case 'FALSE':
          toggleTrail(false);
          break;
      }
      break;
  }

  document.querySelectorAll('.use-keyboard-input').forEach(input => input.value = '');

};

/*
 *
 * BUTTONS
 *
 */

const play = () => {
  if (activeFlights.length == 0) {
    // StopwatchApp.js will handle starting flight animations
    pause(false);
    startTimer();
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
  startTimes = {};
  resetTimer();
  initFlights('flights.json').then(response => {
    initFlightsList();
    displayFlightStrip(null);
    [...activeFlights].forEach(e => removePlane(e)); // shallow copy
  });
  console.log(startTimes);
}

const changeSpeed = () => {
  let speed = document.getElementById('selectedSpeed').value;
  if (!isNaN(speed)) {
    simSpeed = speed;
  } else {
    // for safety
    simSpeed = 1;
  }
};

const toggleTrail = state => {
  activeFlights.forEach(flight => {
    flight?.animprops?.trails?.forEach(trail => {
      state ? trail?.setMap(map) : trail?.setMap(null);
    })
  });
  trailEnabled = state;
}

/*
 *
 * CALLBACK
 *
 */

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), params);

  /**
   * A customized popup on the map.
   */
  Popup = class Popup extends google.maps.OverlayView {
    constructor(position, content, flight) {
      super();
      this.position = position;
      this.flight = flight;
      this.onScreen = false;
      content.classList.add('popup-bubble');
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement('div');
      bubbleAnchor.classList.add('popup-bubble-anchor');
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement('div');
      this.containerDiv.classList.add('popup-container');
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
            ? 'block'
            : 'none';

        if (display === 'block') {
          this.containerDiv.style.left = divPosition.x + 'px';
          this.containerDiv.style.top = divPosition.y + 'px';
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }

        let onScreen = map.getBounds().contains(this.position);

        if (!this.onScreen && onScreen) {
          this.onScreen = true;
          // Remove from flight box
          removeFlightFromFlightsList(this.flight);
        } else if (this.onScreen && !onScreen) {
          // If the flight needs to reappear in the offscreen list if/when it goes off screen again
          this.onScreen = false;
          addFlightToFlightsList(this.flight);
        }

      }
    }
  }

  // Load in locations from JSON
  await initFlights('flights.json');
  initFlightsList();

  console.log(flights);
}

