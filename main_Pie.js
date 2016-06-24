
"use strict";

requirejs.config({
  // ロードする（可能性のある）JavaScriptライブラリの構成情報
  paths: {
    "knockout":       "libs/knockout/knockout-3.4.0.debug",
    "jquery":         "libs/jquery/jquery-2.1.3",
    "jqueryui-amd":   "libs/jquery/jqueryui-amd-1.11.4",
    "promise":        "libs/es6-promise/promise-1.0.0",
    "hammerjs":       "libs/hammer/hammer-2.0.4",
    "ojdnd":          "libs/dnd-polyfill/dnd-polyfill-1.0.0",
    "ojs":            "libs/oj/v2.0.1/debug",
    "ojL10n":         "libs/oj/v2.0.1/ojL10n",
    "ojtranslations": "libs/oj/v2.0.1/resources",
    "text":           "libs/require/text",
    "signals":        "libs/js-signals/signals"
  },
  // AMD (Asynchronous Module Definition; ライブラリのモジュール化や非同期ロードのためのお約束) に
  // 非対応のライブラリをモジュール化するための構成
  shim: {
    "jquery": {
      exports: ["jQuery", "$"]
    }
  }
});
require([
  // このモジュールが依存しているモジュールたち
  "ojs/ojcore",
  "knockout",
  "jquery",
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
  
],
function(oj, ko, $) {

  // リソースのレコードを表すオブジェクトの定義
  var DataModel = oj.Model.extend({
    idAttribute: "dataId",
    parse: function (item) {
      // JSON オブジェクトから ViewModel オブジェクトで使用する形式に変換する
      return {
        month: item.month["value"]
      , count: item.count["value"]
      };
    }
  });

  var url = "http://ja.dbpedia.org/sparql";
  var graphuri = "http://ja.dbpedia.org";
  var query = "PREFIX dbpedia-ja: <http://ja.dbpedia.org/resource/> PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> PREFIX prop-ja: <http://ja.dbpedia.org/property/> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> SELECT ?film_name ?screen_time WHERE { ?film dbpedia-owl:director dbpedia-ja:ビートたけし ; prop-ja:上映時間 ?screen_time  ; rdfs:label ?film_name . } ORDER BY DESC(?screen_time)";
  // リソースのコレクション表すオブジェクトの定義
  var DataCollection = oj.Collection.extend({
    url:   url + "?default-graph-uri=" + encodeURIComponent(graphuri) + "&query=" + encodeURIComponent(query) + "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
    model: new DataModel(),
    parse: function (response){
    return response.results.bindings;
    }
 });
  // index.html 内の id="mainContent" の状態を保持する ViewModel
  function MainViewModel() {
    var self = this;
    
    //円グラフの要素の定義 
        self.innerRadius = ko.observable(0.6);
        self.centerLabel = ko.observable('# Born on the 1st of each month');
        self.labelStyle = ko.observable('font-size:20px;color:#999999;');
        var pieGroups = ["Group A"];
        self.pieGroupsValue = ko.observableArray(pieGroups);
  
                //テキストエリアの要素の定義
     self.Keyword  = ko.observable('SELECT  (count(?label) AS ?count) ?month \n\
WHERE {\n\
  ?s <http://ja.dbpedia.org/property/生日> 1 ;\n\
     <http://ja.dbpedia.org/property/生月> ?month ;\n\
     rdfs:label ?label .\n\
}\n\
GROUP BY ?month\n\
ORDER BY ?month');
      
     self.query = self.Keyword();
     self.Search = function(test, event) {
         self.query = self.Keyword();
         self.EmpCollectionFetch(self.query);
     };

    // Knockout.jsによって監視されているので双方向データバインドが有効なプロパティ
    self.titleLabel  = ko.observable("JET SPARQL");
    self.data   = ko.observableArray();
    
    // RESTサービス呼び出しのための Collectionのインスタンスを生成
    self.DataCollection = new DataCollection();
    //入力したSPARQLをurlに挿入
    self.DataCollectionFetch = function(queryParam){
            var url = "http://ja.dbpedia.org/sparql";
            var graphuri = "http://ja.dbpedia.org";
            self.DataCollection.url =  url + "?default-graph-uri=" + encodeURIComponent(graphuri) + "&query=" + encodeURIComponent(queryParam) + "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";
           
          self.DataCollection.fetch({
          success: function (collection, response, options) {
            // サービス呼び出しが成功した時の実行されるコールバック関数
            self.data(oj.KnockoutUtils.map(collection));
          },
          error: function (jqXHR, textStatus, errorThrown) {
          //   oj.Logger.error("Error: " + textStatus);
          alert("Error: " + textStatus);
          }
        });
    };
    self.DataCollectionFetch(self.query);

    // グラフ（ojChart コンポーネント）で表示するためのデータを抽出
    // self.data に変更があるとコールバック関数が呼ばれる
    // チャートのデータは次のようなオブジェクトの配列
    // { name: <系列データの名前>, items: [ <グループ#1 の値>, <グループ#2の値>, ... ] }
    self.chartSeries = ko.computed(function () {
      var seriesValues = [];
      if (self.data().length !== 0) {
        var values = {};
        $.each(self.data(), function (index, data) {
          var month    = data.month()+ "月";
          var count   = data.count();
            values[month] = { name: month, items: [ count ] };
        });
        $.each(values, function (key, value) {
          seriesValues.push(value);
        });
      }
      return seriesValues;
    });
    
  };

  $(document).ready(function() {
    ko.applyBindings(new MainViewModel(), document.getElementById("mainContent"));
  });

});