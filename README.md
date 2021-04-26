# IST 331 Team 6
Below are some quick details on the usage of the flight simulator.
## JSON format
flights.json should be an array of flight objects. The structure of the flight object is as follows:

    {
        "flightId": (preferably 6-character) id,
        "aircraftType": (4-character) aircraft type, 
        "altitude": altitude in meters,
        "groundspeed": speed in knots,
        "startTime": time from simulation start in seconds,
        "origin": {
            "name": starting location 3-character name,
            "lat": starting location latitude,
            "long": starting location longitude
        },
        "destination": {
            "name": ending location 3-character name,
            "lat": ending location latitude,
            "long": ending location longitude
        }
    },
Additionally, you may optionally specify 1 or more midpoints between the origin and destination in the following format:

    "midpoints": [
        {
            "name": midpoint location 3-character name,
            "lat": midpoint location latitude,
            "long": midpoint location longitude
        },
        ...
    ]
An example:

    [
	    {
	        "flightId": "N536SP",
	        "aircraftType": "C172", 
	        "altitude": 2600,
	        "groundspeed": 220,
	        "startTime": 10,
	        "origin": {
	            "name": "PHL",
	            "lat": 39.8729,
	            "long": -75.2437
	        },
	        "destination": {
	            "name": "JFK",
	            "lat": 40.6413,
	            "long": -73.7781
	        }
	    },
	    {
	        "flightId": "X536SP",
	        "aircraftType": "BE20",
	        "altitude": 2600,
	        "groundspeed": 110,
	        "startTime": 0,
	        "origin": {
	            "name": "MDT", 
	            "lat": 40.1942,
	            "long": -76.7577
	        },
	        "destination": {
	            "name": "PHL",
	            "lat": 39.8729,
	            "long": -75.2437
	        },
	        "midpoints": [
	            {
	                "name": "FIX1",
	                "lat": 40.3729,
	                "long": -75.2137
	            }
	        ]
	    }
    ]
## Keyboard Commands
There are four implemented keyboard commands. These change a flight's heading, altitude, or speed and toggle flight trail visibility.
### Change Heading
 - H [*heading*] [*id*]
 - HEADING [*heading*] [*id*]

Both of these function the same. Headings are expressed in degrees clockwise from North, per Google Maps API. That is, 0 is north, 90 or -270 is east, 180 or -180 is south, and 270 or -45 is west.

Example: `H 90 N536SP` will make NF36SP flight straight east.

### Change Altitude
 - A [*altitude*] [*id*]
 - ALTITUDE [*altitude*] [*id*]

Both of these function the same. Altitude is expressed in meters. Note altitude is displayed divided by 100 on the data block. The value to enter is the actual altitude. Other than the data block updating, there are no observable changes with altitude change.

Example: `A 5000 N536SP` will change NF36SP's altitude to 5000 m (will display 050).

### Change Speed
 - S [*speed*] [*id*]
 - SPEED [*speed*] [*id*]

Both of these function the same. Speed is expressed in knots. Note speed is displayed divided by 10 on the data block. The value to enter is the actual speed. This will result in an observable speed change.

Example: `S 530 N536SP` will change NF36SP's speed to 530 kt (will display 53).

### Toggle Trail Visibility
 - TRAILENABLED [TRUE/FALSE]

Enables or disables visibility of trails on the scope.

Example: `TRAILENABLED TRUE` will make trails visible.
