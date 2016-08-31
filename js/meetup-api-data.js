/*
* Methods for MeetupAPI Data.
*/
App.MeetupData = function() {

	return {
		prepareOpenEventJson: prepareOpenEventJson,

	}

/*
* Prepares data for Gmaps markers.
*/
	function prepareOpenEventJson(data) {
		console.log('In MeetupData.prepareOpenEventJson : ', data);

		//Clear the map, before rendering new points.
		var muName = [];
		var muDescript = [];
		var muUrl = [];
		var muAddress = [];
		var allLatLng = [];
		var muLat = [];
		var muLon = [];
		var muTime = [];

		var dataLen = data.results.length;
		//console.log("api returned " + dataLen + " total results");
		//clearMapBeforeRender();
		//Loop through the data, prepare the arrays.
		$.each(data.results, function(i, value){
		  var venueObj = value.venue;
		  
		  if (venueObj && venueObj.lat !== 0){
		    muName.push(value.name);
		    muTime.push( parseMiliTime( value.time ) );
		    muDescript.push(value.description);
		    muUrl.push(value.event_url);
					muLat.push(venueObj.lat);
					muLon.push(venueObj.lon);
		    //Address information
					muAddress.push(venueObj.address_1 + "</h3><h3>" + venueObj.city);
		  } else {
		    console.log("lat/lon not founded. ");
		    return 0;
		  }
		  
		// Exclude empty lons or lats or values of 0.
			muLon = _.without(muLon, 0);
		  	muLat = _.without(muLat, 0);
		});
		App.TechMeet.placeEachLatLngPoint(muName, muDescript, muUrl, muLat, muLon, muAddress, muTime);
	}

/*
* Parse mtime function
*
*/
	function parseMiliTime(mtime) {

		var utcTime = new Date(mtime);
		var utcTimeArr = utcTime.toString().split(' ');
		//console.log(utcTime);
		var tObj = {
			weekDay: utcTimeArr[0],
			month: utcTimeArr[1],
			date: utcTimeArr[2],
			year: utcTimeArr[3],
			time: utcTimeArr[4]
		}
		//console.log(tObj);
		return tObj;
	}

}