define(["knockout", "main_view_model"], function(ko, MainViewModel){
    var BarViewModel = function BarViewModel(dataCollection, defaultQuery, yasqeId) {
        var self = this;
        MainViewModel.call(self, dataCollection, defaultQuery, yasqeId);

        // グラフ（ojChart コンポーネント）で表示するためのデータを抽出
    		// self.data に変更があるとコールバック関数が呼ばれる
    		// チャートのデータは次のようなオブジェクトの配列
    		// { name: <系列データの名前>, items: [ <グループ#1 の値>, <グループ#2の値>, ... ] }
    		self.chartSeries = ko.computed(function () {
    			  var seriesValues = [];
    			  if (self.data().length !== 0) {
    				    var values = {};
    				    $.each(self.data(), function (index,data) {
    					      var film_name = data.film_name();
    					      var screen_time = data.screen_time();
    					      values[film_name] = {name: film_name, items: [screen_time]};
    				    });
        				$.each(values, function (key, value) {
        					seriesValues.push(value);
        			  });
    			  }
    		    return seriesValues;
    		});
    };

    return BarViewModel;
});
