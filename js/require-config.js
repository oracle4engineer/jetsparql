var require = {
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
      "signals": "libs/js-signals/signals",
      "factory": "utils/factory",
      "main_view_model": "view_models/main",
      "pie_view_model": "view_models/pie",
      "bar_view_model": "view_models/bar",
      "yasqe": "http://cdn.jsdelivr.net/yasqe/2.10.0/yasqe.bundled.min"
  },
  // AMD (Asynchronous Module Definition; ライブラリのモジュール化や非同期ロードのためのお約束) に
  // 非対応のライブラリをモジュール化するための構成
  shim: {
      "jquery": {
          exports: ["jQuery", "$"]
      },
      "yasqe": {
          exports: "YASQE"
      }
  }
};
