"use strict";

require([
    // このモジュールが依存しているモジュールたち
    "ojs/ojcore",
    "knockout",
    "jquery",
    "factory",
    "pie_view_model",
    "main_view_model",
    "ojs/ojknockout",
    "ojs/ojmodel",
    "ojs/ojknockout-model",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojchart",
    "ojs/ojbutton",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojinputnumber",
    "ojs/ojselectcombobox"
], function(oj, ko, $, factory, PieViewModel) {
    var parseFunction = function(item){
        return {
            month: item.month["value"],
            count: item.count["value"]
        };
    };
    var defaultQueryKeyword = 'SELECT  (count(?label) AS ?count) ?month \n\
WHERE {\n\
?s <http://ja.dbpedia.org/property/生日> 1 ;\n\
<http://ja.dbpedia.org/property/生月> ?month ;\n\
rdfs:label ?label .\n\
}\n\
GROUP BY ?month\n\
ORDER BY ?month';
    var dataCollection = factory.createCollection(parseFunction);
    var pieViewModel = new PieViewModel(dataCollection, defaultQueryKeyword, 'sparql_textarea');

    $(document).ready(function() {
        ko.applyBindings(pieViewModel, document.getElementById("mainContent"));
    });
});
