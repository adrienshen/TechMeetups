
//meetip api key = 1719487a4a3c39b3e241e181837529

$(function() {

		var meetupName = [], // from API returned
				meetupDescript = [],
				meetupUrl = [],
				meetupAddress = [],

				allLatlng = [],
				allMarkers = [], // from API returned

				infowindow = null,
				pos,
				userCords,
				tempMarkerHolder = [];

		// Start geolocation
		if (navigator.geolocation) {
				function error(err) {
						console.warn('ERROR(' + err.code + '): ' + err.message);
				}

				function success(pos){
						userCords = pos.coords;
						//return userCords;
				}
				// Get the user's current position
				navigator.geolocation.getCurrentPosition(success, error);
				//console.log(pos.latitude + " " + pos.longitude);
				} else {
						alert('Geolocation is not supported in your browser');
				}
				// End Geo location

		// gmaps default options
		var mapOptions = {
				zoom: 4,
				center: new google.maps.LatLng(37.09024, -100.712891),
				panControl: false,
				panControlOptions: {
						position: google.maps.ControlPosition.BOTTOM_LEFT
				},
				zoomControl: true,
				zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.RIGHT_CENTER
				},
				scaleControl: false
		};

		//Adding infowindow option
		infowindow = new google.maps.InfoWindow({
				content: "holding..."
		});

		//Fire up Google maps and place inside the map-canvas div
			// map should be decleared with var right?
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		// Grab form data ( zip code ) with some jQuery.
		// On input form submit...
		$('#chooseZip').submit(function() {
				function clearMap(map) {
						for ( var i = 0; i < allMarkers.length; ++i ) {
          			allMarkers[i].setMap(null);
				}
		}
				// Clearing arrays, maybe should be in clearMap fn.
				meetupName = [];
				meetupDescript = [];
				meetupUrl = [];
				meetupAddress = [];

				allLatlng = [];
				allMarkers = [];
				clearMap(); // clear the data
				//console.log(allMarkers);

		//define and set variables
		var userZip = $("#textZip").val();
		//console.log("This-> " + userCords.latitude);

		var accessURL;
		var key = "1719487a4a3c39b3e241e181837529";
		if(userZip) {
				accessURL = "https://api.meetup.com/2/open_events.json?zip="+ userZip +"&page=30&category=34&time=,1w&key=" + key;
				//console.log(accessURL);
		}
		else {
				console.log('use zip, geolocation not working..')
				//accessURL = "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + userCords.latitude + "&lng=" + userCords.longitude;
		}

		var meetupLat = [], meetupLon = [];
			//Use the zip code and return all market ids in area.

		// Make the HTTP request for meetup data
		$.ajax({
				type: "GET",
				contentType: "application/json; charset=utf-8",
				url: accessURL,
				dataType: 'jsonp',
				success: function (data) {
						var dataLen = data.results.length;
						console.log("api returned " + dataLen + " total results");

						$.each(data.results, function (i, val) {
								var venueObj = val.venue;
								//console.log(venueObj);

								if ( (venueObj && venueObj.lat !== 0) ) {
										// Information we need
										meetupName.push(val.name);
										meetupDescript.push(val.description);
										meetupUrl.push(val.event_url);

										// meetupLat.push( venueObj.lat ) ,use dot notation whenever possible.
										meetupLat.push(venueObj['lat']);
										//meetupLong.push( venueObj.lon )
										meetupLon.push(venueObj['lon']);

										// Address
										meetupAddress.push(
										venueObj['address_1'] + "</h3><h3>" +
										venueObj['city']
										);

								}
								else {
										console.log("lat/lon not founded. ");
										return;
								}

						}); // end of $.each

						// We dont want any empty long or lats
						meetupLon = _.without(meetupLon, 0);
            //console.log(meetupLon);
            meetupLat = _.without(meetupLat, 0);
						//console.log(meetupLat);
          	//console.log(meetupAddress);

						for (var i = 0; i < meetupLat.length; ++i) {
								//set the markers.
								myLatlng = new google.maps.LatLng(meetupLat[i], meetupLon[i]);

								allMarkers = new google.maps.Marker({
										position: myLatlng,
										map: map,
										title: "Meetup",
										html:
												'<div class="markerPop">' +
                                        "<h2>"+ meetupName[i] +"</h2>" +
                                        "<h3>"+ meetupAddress[i] +"</h3>" +
                                        "<p>"+ meetupDescript[i] +"</p>" +
                                        "<a href='"+ meetupUrl[i] +"'>"+ meetupUrl[i] +"</p>" +
												'</div>'
								});

        				allLatlng.push(myLatlng);

								// Listens to markers being clicked, if so open the info panel
    						google.maps.event.addListener(allMarkers, 'click', function () {
    								infowindow.setContent(this.html);
    								infowindow.open(map, this);
    						});

								//  Make an array of the LatLng's of the markers you want to show
								//  Create a new viewpoint bound
								var bounds = new google.maps.LatLngBounds();
								//  Go through each...
								for (var i = 0, len = allLatlng.length; i < len; i++) {
						  			//  And increase the bounds to take this point
						  			bounds.extend (allLatlng[i]);
								}
								map.fitBounds(bounds);
          	} // End for loop


				} // End of ajax success fn.
		}); // End ajax request
    return false; // important: prevents the form from submitting

}); // End of submit handler
}); // End fn.
