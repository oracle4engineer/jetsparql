define(["knockout", "main_view_model"], function(ko, MainViewModel){
    var PieViewModel = function PieViewModel(dataCollection, defaultQuery, yasqeId) {
        var self = this;
        var defaultInnerRadius = 0.6;
        var defaultCenterLabel = '# Born on the 1st of each month';
        var defaultLabelStyle = 'font-size:20px;color:#999999;';
        var pieGroups = ["Group A"];

        MainViewModel.call(self, dataCollection, defaultQuery, yasqeId);

        //円グラフの要素の定義
        self.innerRadius = ko.observable(defaultInnerRadius);
        self.centerLabel = ko.observable(defaultCenterLabel);
        self.labelStyle = ko.observable(defaultLabelStyle);
        self.pieGroupsValue = ko.observableArray(pieGroups);

        // グラフ（ojChart コンポーネント）で表示するためのデータを抽出
        // self.data に変更があるとコールバック関数が呼ばれる
        // チャートのデータは次のようなオブジェクトの配列
        // { name: <系列データの名前>, items: [ <グループ#1 の値>, <グループ#2の値>, ... ] }
        self.chartSeries = ko.computed(function() {
            var seriesValues = [];
            if (self.data().length !== 0) {
                var values = {};
                $.each(self.data(), function(index, data) {
                    var month    = data.month()+ "月";
                    var count   = data.count();
                    values[month] = { name: month, items: [ count ] };
                });
                $.each(values, function(key, value) {
                    seriesValues.push(value);
                });
            }
         return seriesValues;
       });
    };
    return PieViewModel;
});
