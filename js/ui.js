$(function() {
	$(".citySearch").hide(100);
	$( ".zipSearch" ).hide(100);

	$( "#searchZip" ).click(function() {
		//$("#searchZip").hide();
		$(".citySearch").hide();
		$(".zipSearch" ).show(100);
	});
	$("#searchCity").click(function() {
		//$("#searchCity").hide();
		$(".zipSearch" ).hide();
		$(".citySearch").show(100);
	});
});