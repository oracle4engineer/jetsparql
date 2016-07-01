"use strict";

require([
    // このモジュールが依存しているモジュールたち
    "ojs/ojcore",
    "knockout",
    "jquery",
    "factory",
    "bar_view_model",
    "ojs/ojknockout",
    "ojs/ojmodel",
    "ojs/ojknockout-model",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingtabledatasource",
    "ojs/ojtable",
    "ojs/ojpagingcontrol",
    "ojs/ojchart",
    "ojs/ojbutton",
    "ojs/ojinputtext"
], function (oj, ko, $, factory, BarViewModel) {
    var parseFunction = function (item) {
        // JSON オブジェクトから ViewModel オブジェクトで使用する形式に変換する
        return {
            film_name: item.film_name["value"],
            screen_time: item.screen_time["value"]
        };
    };

    var defaultQueryKeyword = 'PREFIX dbpedia-ja: <http://ja.dbpedia.org/resource/>  \n\
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>  \n\
PREFIX prop-ja: <http://ja.dbpedia.org/property/>  \n\
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  \n\
SELECT ?film_name ?screen_time  \n\
WHERE { ?film dbpedia-owl:director  \n\
    dbpedia-ja:ビートたけし ;  \n\
    prop-ja:上映時間 ?screen_time  ;  \n\
    rdfs:label ?film_name . }  \n\
ORDER BY DESC(?screen_time)';

    var dataCollection = factory.createCollection(parseFunction);
    var barViewModel = new BarViewModel(dataCollection, defaultQueryKeyword, 'sparql_textarea');

    $(document).ready(function () {
        ko.applyBindings(barViewModel, document.getElementById("mainContent"));
    });
});
