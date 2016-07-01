define(["knockout", "yasqe"], function(ko, YASQE){
  var MainViewModel = function MainViewModel(dataCollection, defaultQuery, yasqeId) {
      var self = this;
      var yasqe = YASQE(document.getElementById(yasqeId));
      yasqe.setValue(defaultQuery)

      self.yasqe = yasqe
      self.titleLabel = ko.observable("JET SPARQL");
      self.data = ko.observableArray();
      self.dataCollection = dataCollection;

      self.search = function(test, event) {
          self.query = self.yasqe.getValueWithoutComments();
          self.dataCollectionFetch(self.query);
      };

      self.dataCollectionFetch = function(queryParam) {
          self.dataCollection.updateUrl(queryParam)

          self.dataCollection.fetch({
              success: function(collection, response, options) {
                  self.data(oj.KnockoutUtils.map(collection));
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  alert("Error: " + textStatus);
              }
          });
      };

      self.tableDataSource = ko.computed(function () {
          return new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.data()));
      });
      self.dataCollectionFetch(defaultQuery);
    };

    return MainViewModel;
});
