/* TechMeet UI components and rendering */
	

App.TechMeetUI = function() {

	return {

		renderUnifiedSearchPanel: renderUnifiedSearchPanel
		, 
	}

	//Render UnifiedSearchPanel from Handlebars.
	function renderUnifiedSearchPanel() {
		var searchCities = App.SearchCities();
  		var searchZip = App.ZipSearch();

		getTemplateAjax('UnifiedSearch', '#content-area', null, function(){


			console.log('here.');

			var $tmSearch = $('.tm-search');
			var $goBtn = $('.goBtn');
			var $submit = $('#submit');

			/* When search input is clicked, expand the width */
			$tmSearch.on('click', function(event) {
				$tmSearch.addClass('search--expanded');
				$goBtn.addClass('goBtn--expanded');
			});
			/* Enter key should search as well */
			$tmSearch.on('keyup', function(event) {

				if (event.keyCode === 13) {
					$submit.click();
				}
			});

		  //Listen to event handlers
		    // uniSearch click event.
		    $submit.on('click', function(event){
		      event.preventDefault();

		      var userInput = $('#q').val();
		      if ( Number(userInput) ) {

		      	// Is zip
		      	console.log('zip = ', userInput);
		      	searchZip.search(userInput);

		      } else {

		      	// Is city
		      	console.log('city = ', userInput);
		      	searchCities.search(userInput);

		      }
		    });
		});

	}

	function getTemplateAjax(path, target, jsonData, initEvents) {
		var source;
	  	var template;
	  	var jsonData1 = jsonData ? jsonData : {};
		var templateBase = 'js/ui-templates/';
		var templateExt = '.handlebars';

	  	$.ajax({
			url: templateBase+ path+ templateExt,
	    	cache: true,
	    	success: function(data) {
	      		source    = data;
	      		template  = Handlebars.compile(source);
	      		$(target).append(template(jsonData1));

	      		initEvents();
	    	}
	  	});         
	}

}

// 