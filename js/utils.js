/*
* Application ultility methods.
*
*/

App.Utility = function(){

	var googleGeoAddressAPI = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	var KEY_PARAM = "&key=AIzaSyDZNWp4XpYouSL-NaQXIjXy47P88QUHllA";

	/*
	* Use the Gmaps API to get GeoLocation from inputed address/city.
	* @param: addressString, 
	*
	*/
	function address2GeoCode(cityString, cb){

		var formedUrl = googleGeoAddressAPI+ cityString+ KEY_PARAM;
		var geoData;

	    $.ajax({
	      type: 'GET',
	      url: formedUrl,
	      
	      success: function(data) {
	        console.log(data.results[0].geometry.location);
	        data.results[0].geometry.location.city = cityString;
	      	cb(data.results[0].geometry.location);
	      	
	      }
	    });
	}


	return {
		address2GeoCode: address2GeoCode,

	}

};