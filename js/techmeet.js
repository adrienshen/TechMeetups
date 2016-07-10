
App.TechMeet = (function() {
  //Modules instance.
  var searchCities1 = App.SearchCities();
  var searchZip1 = App.ZipSearch();

  //Declare needed variables.
  var CONST = {
    MUKEY: "1719487a4a3c39b3e241e181837529",
    CATEGORY: 34,
    LPP: 50,
    RADIUS: 50,

  }

  //Gmaps options.
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
  function init(){
    initListenEvents();
    doGeoNavigation();
    googleMapsInit();
  }
    
  //Listen to event handlers
  function initListenEvents() {
    // zipcode submit event
    $('#submitZip').on('click', function(event){
      event.preventDefault();

      var zipEntered = $("#textZip").val();
      console.log('zip = ', zipEntered);

      searchZip1.search(zipEntered);
    });
    
    // city search event
    $('#submitCity').on('click', function(event){
      event.preventDefault();
      //Get value from field
      var cityEntered = $('#textCity').val();
      console.log('City value : ',  cityEntered);

      searchCities1.search(cityEntered);
    });
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
  
/*
* GoogleMap place points/markers on the map plane and add event listeners to each marker.
*
*/
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

/*
* GoogleMap increase bounds.
*
*/
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
    CONST: CONST,
    /*
    * @params Object: data, the return data from Meetup Events API.
    */
    increaseBounds: increaseBounds,
    placeEachLatLngPoint: placeEachLatLngPoint,
    init: init,
  }
})();
