"use strict";

require([
    // このモジュールが依存しているモジュールたち
    "ojs/ojcore",
    "knockout",
    "jquery",
    "factory",
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
], function (oj, ko, $, factory, MainViewModel) {
    var parseFunction = function(item){
        return {
            name: item.name["value"],
            birthYear: item.birthYear["value"]
        }
    }
    var defaultQueryKeyword = 'SELECT DISTINCT ?name ?birthYear\n\
WHERE {\n\
  ?s <http://ja.dbpedia.org/property/生日> 1 ;\n\
    <http://ja.dbpedia.org/property/生月> 1 ;\n\
    <http://ja.dbpedia.org/property/生年> ?birthYear ;\n\
    rdfs:label ?name .\n\
}\n\
ORDER BY ?birthYear'
    var dataCollection = factory.createCollection(parseFunction);
    var mainViewModel = new MainViewModel(dataCollection, defaultQueryKeyword, 'sparql_textarea');

    $(document).ready(function(){
        ko.applyBindings(mainViewModel, document.getElementById("mainContent"));
    });
});
