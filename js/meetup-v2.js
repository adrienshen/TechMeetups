
var TechMeetups = (function() {
  //Declare needed variables.
  var key = "1719487a4a3c39b3e241e181837529";
  // var meetupName = [];
  // var meetupDescript = [];
  // var meetupUrl = [];
  // var meetupAddress = [];
  //
  // var meetupLat = [],
  //     meetupLon = [];

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
  
  var map;
  var infoWindow = null; 
  var pos; 
  var userCords; 
  var tempMarkerHolder = [];
  
  //Initialize the application
  function initApp(){
    initListenEvents();
    doGeoNavigation();
    googleMapsInit();
  }
    
  //Listen to event handlers
  function initListenEvents() {
    // zipcode submit event
    $('#chooseZip').on('click', searchWithZipCode);
    // city search event
    $('#submitCity').on('click', SearchCities.search);
  }
  
  //Do geonavigation
  function doGeoNavigation() {
		if (navigator.geolocation) {
				function error(err) {
						console.warn('ERROR(' + err.code + '): ' + err.message);
				}

				function success(pos){
						userCords = pos.coords;
				}
        
				// Get the user's current position
				navigator.geolocation.getCurrentPosition(success, error);
				//console.log(pos.latitude + " " + pos.longitude);
				} else {
					alert('Geolocation is not supported in your browser');
				}
  }
  
  //Fire up the googleMaps API.
  function googleMapsInit() {
    
		//Adding infowindow option
		infowindow = new google.maps.InfoWindow({
				content: "holding..."
		});
		//Fire up Google maps and place inside the map-canvas div
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
    
  //The main service starting point.
  function searchWithZipCode(event) {
    event.preventDefault();
    
    var userZip = $("#textZip").val();
    var accessURL = "";
    
    //Form the url to be supply to the API.
    if (userZip) {
      accessURL = "https://api.meetup.com/2/open_events.json?zip="+ userZip +"&page=30&category=34&time=,1w&key=" + key;
    } else {
      alert('zip not valid or not entered.');
    }
    
    //Make the actual AJAX call to Meetup & Gmaps APIS.
    $.ajax({
      type: 'GET',
      contentType: "application/json; charset=utf-8",
      url: accessURL,
      dataType: 'jsonp',
      
      success: function(data) {
        renderPointsCB(data);
      }
    });
    return false; //so the form won't really submit and refresh the page.
  }
  
  
  function renderPointsCB(data) {
    console.log(data);
    
  //Clear the map, before rendering new points.
    console.log('in clearMapBeforeRender fn');
    var meetupName = [];
    var meetupDescript = [];
    var meetupUrl = [];
    var meetupAddress = [];
    var allLatLng = [];
    var meetupLat = [];
    var meetupLon = [];

    var dataLen = data.results.length;
    //console.log("api returned " + dataLen + " total results");
    //clearMapBeforeRender();
    //Loop through the data, prepare the arrays.
    $.each(data.results, function(i, value){
      var venueObj = value.venue;
      
      if (venueObj && venueObj.lat !== 0){
        meetupName.push(value.name);
        meetupDescript.push(value.description);
        meetupUrl.push(value.event_url);
				meetupLat.push(venueObj.lat);
				meetupLon.push(venueObj.lon);
        //Address information
				meetupAddress.push(venueObj.address_1 + "</h3><h3>" + venueObj.city);
      } else {
        console.log("lat/lon not founded. ");
        return 0;
      }
      
			// We dont want any empty long or lats or values of 0.
			meetupLon = _.without(meetupLon, 0);
      meetupLat = _.without(meetupLat, 0);
    });
    placeEachLatLngPoint(meetupName, meetupDescript, meetupUrl, meetupLat, meetupLon, meetupAddress);
  }
  
  function placeEachLatLngPoint(meetupName, meetupDescript, meetupUrl, meetupLat, meetupLon, meetupAddress) {

    var allLatLng = [];
    var markers = [];

		for (var i = 0; i < meetupLat.length; ++i) {
				//set the markers.
				myLatLng = new google.maps.LatLng(meetupLat[i], meetupLon[i]);

				markers = new google.maps.Marker({
						position: myLatLng,
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

				allLatLng.push(myLatLng);

				// Listens to markers being clicked, if so open the info panel
				google.maps.event.addListener(markers, 'click', function () {
						infowindow.setContent(this.html);
						infowindow.open(map, this);
				});
  	}
    increaseBounds(allLatLng);
  }

  function increaseBounds(allLatLng) {
        //  Make an array of the LatLng's of the markers you want to show
        //  Create a new viewpoint bound
        var bounds = new google.maps.LatLngBounds();
        //  Go through each...
        for (var i = 0, len = allLatLng.length; i < len; i++) {
            //  And increase the bounds to take this point
            bounds.extend(allLatLng[i]);
        }
        map.fitBounds(bounds);
  }

  return {
    increaseBounds: increaseBounds,
    placeEachLatLngPoint: placeEachLatLngPoint,
    initApp: initApp,
  }
})();
