

App.SearchCities = function(){

	//Setup MeetupAPI defaults.
	var KEY = "1719487a4a3c39b3e241e181837529";
	var LPP = 50;
	var CATEGORY = 34;
	var RADIUS = 50;

	//Public interface.
	return {
		/*
		* @params String: cityString, the string value of the city name.
		*
		*/
		search: search,

	}

	function search(cityString){
		'use strict';

		event.preventDefault();

		var utility = App.Utility();

		utility.address2GeoCode(cityString, getCitiesFromMeetup);


	}

	function getCitiesFromMeetup(geoData){

		console.log('In SearchCities, ', geoData);
		//Call the Meetup Open Events API.

		eventsURL = `https://api.meetup.com/2/open_events.json?lon=${geoData.lng}&lat=${geoData.lat}&page=${LPP}&category=${CATEGORY}&time=,2w&key=${KEY}&radius=${RADIUS}`;

		$.ajax({
			method: 'GET',
			contentType: "application/json; charset=utf-8",
			url: eventsURL,
			dataType: 'jsonp',

			success: function(data) {

				var meetupData = App.MeetupData();
				meetupData.prepareOpenEventJson(data);
				
			}
		});
	}

};