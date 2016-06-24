"use strict";

requirejs.config({
    // ロードする（可能性のある）JavaScriptライブラリの構成情報
    paths: {
        "knockout": "libs/knockout/knockout-3.4.0.debug",
        "jquery": "libs/jquery/jquery-2.1.3",
        "jqueryui-amd": "libs/jquery/jqueryui-amd-1.11.4",
        "promise": "libs/es6-promise/promise-1.0.0",
        "hammerjs": "libs/hammer/hammer-2.0.4",
        "ojdnd": "libs/dnd-polyfill/dnd-polyfill-1.0.0",
        "ojs": "libs/oj/v2.0.1/debug",
        "ojL10n": "libs/oj/v2.0.1/ojL10n",
        "ojtranslations": "libs/oj/v2.0.1/resources",
        "text": "libs/require/text",
        "signals": "libs/js-signals/signals"
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
    "ojs/ojinputtext"

],
        function (oj, ko, $) {

            // リソースのレコードを表すオブジェクトの定義
            var DataModel = oj.Model.extend({
                idAttribute: "dataId",
                parse: function (item) {
                    // JSON オブジェクトから ViewModel オブジェクトで使用する形式に変換する
                    return {
                        film_name: item.name["value"]
                        , screen_time: item.birthYear["value"]
                    };
                }
            });

            var url = "http://ja.dbpedia.org/sparql";
            var graphuri = "http://ja.dbpedia.org";
            var query;
            // リソースのコレクション表すオブジェクトの定義
            var DataCollection = oj.Collection.extend({
                url: url + "?default-graph-uri=" + encodeURIComponent(graphuri) + "&query=" + encodeURIComponent(query) + "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
                model: new DataModel(),
                parse: function (response) {
                    return response.results.bindings;
                }
            });
            // index.html 内の id="mainContent" の状態を保持する ViewModel
            function MainViewModel() {
                var self = this;

                //テキストエリアの要素の定義
                self.Keyword = ko.observable('SELECT DISTINCT ?name ?birthYear\n\
WHERE {\n\
  ?s <http://ja.dbpedia.org/property/生日> 1 ;\n\
    <http://ja.dbpedia.org/property/生月> 1 ;\n\
    <http://ja.dbpedia.org/property/生年> ?birthYear ;\n\
    rdfs:label ?name .\n\
}\n\
ORDER BY ?birthYear');
                self.query = self.Keyword();
                
                //ボタン実行時に呼び出されるファンクションの定義
                self.Search = function (test, event) {
                    self.query = self.Keyword();
                    self.DataCollectionFetch(self.query);
                };
                
                // Knockout.jsによって監視されているので双方向データバインドが有効なプロパティ
                self.titleLabel = ko.observable("JET SPARQL");
                self.data = ko.observableArray();

                // RESTサービス呼び出しのための Collectionのインスタンスを生成
                self.DataCollection = new DataCollection();
                //テキストエリアに入力したSPARQL文を引数にRESTサービスを呼び出し
                self.DataCollectionFetch = function (queryParam) {
                    var url = "http://ja.dbpedia.org/sparql";
                    var graphuri = "http://ja.dbpedia.org";
                    self.DataCollection.url = url + "?default-graph-uri=" + encodeURIComponent(graphuri) + "&query=" + encodeURIComponent(queryParam) + "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";

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

                // 表形式（ojTable コンポーネント）で表示されるデータのコレクション
                // self.data に変更があるとコールバック関数が呼ばれる
                self.tableDataSource = ko.computed(function () {
                    return new oj.PagingTableDataSource(new oj.ArrayTableDataSource(self.data()));
                });
            }
            ;

            $(document).ready(function () {
                ko.applyBindings(new MainViewModel(), document.getElementById("mainContent"));

            });

        });