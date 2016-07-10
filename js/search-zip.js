/*
* TechMeet Zip Search
* zip search only works in the United States.
*
*/
App.ZipSearch = function() {

	// Setup constants


	//Public interface
	return {

		search: search,
	}


	function search(enteredZipValue) {

		var MU_URL = `https://api.meetup.com/2/open_events.json?zip=${enteredZipValue}&page=${App.TechMeet.CONST.LPP}&category=${App.TechMeet.CONST.CATEGORY}&time=,2w&key=${App.TechMeet.CONST.MUKEY}&radius=${App.TechMeet.CONST.RADIUS}`;

		$.ajax({
			type:'GET',
			contentType: "application/json; charset=utf-8",
			url: MU_URL,
			dataType: 'jsonp',

			success: function(data){
				console.log('data from search zip = ', data);

				var meetupData = App.MeetupData();
				meetupData.prepareOpenEventJson(data);
			}
		});
		return false;
	}

}