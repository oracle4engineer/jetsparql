define([
  "ojs/ojcore",
  "ojs/ojknockout",
  "ojs/ojmodel",
  "ojs/ojknockout-model"
], function(oj){
    var factory = {}
    var sparqlUrl = "http://ja.dbpedia.org/sparql";
    var graphUri = "http://ja.dbpedia.org";

    factory.createModel = function(parseFunction){
      var DataModel = oj.Model.extend({
          idAttribute: "dataId",
          parse: parseFunction
      });
      return new DataModel();
    };

    function _defineUrl(query){
        return (sparqlUrl +
                "?default-graph-uri=" + encodeURIComponent(graphUri) +
                "&query=" +
                encodeURIComponent(query) +
                "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on");
    }

    factory.createCollection = function(parseFunction, query){
        var model = factory.createModel(parseFunction);

        var DataCollection = oj.Collection.extend({
            query: query,
            url: _defineUrl(query),
            model: model,
            parse: function (response) {
                return response.results.bindings;
            }
        });
        DataCollection.prototype.updateUrl = function(query){
            this.query = query;
            this.url = _defineUrl(query);
        }
        return new DataCollection();
    };
    return factory;
});
