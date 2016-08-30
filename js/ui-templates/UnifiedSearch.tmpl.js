(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['UnifiedSearch'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "	<div id=\"control\" class=\"Unified-search\">\n		<div class=\"seach-header\">\n			<h5 class=\"search-header__title\">Find Nearby Tech Events: </h5>\n		</div>\n\n		<div id=\"clear\"></div>\n\n		<div>\n\n			<div class=\"search-bar\">\n				<input type=\"search\" name=\"search-q\" id=\"q\" class=\"tm-search\" placeholder=\"zip or city\" >\n				<button id=\"submit\" class=\"goBtn\">GO</button>\n			</div>\n\n			<div id=\"clear\"></div>\n\n		</div>\n	</div>\n";
},"useData":true});
})();