/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
    //========================ここにイベントを書く=============================//
      document.addEventListener('deviceready', this.onDeviceReady, false);
      var module = ons.bootstrap('myApp', ['onsen']);

      //アプリ全体のコントローラ
      module.controller('AppController', ['$scope', function($scope) {
        console.log("onsen is ready");
      }]);

      //楽器ページのコントローラ
      module.controller('SoundController', ['$scope', function($scope){
        console.log("Sound page is ready");
        //AngularJSのディレクティブの書式
        $scope.angTest = "ここが楽器ページ！";


        AUDIO_LIST = {
          "se00": new Audio("sound/cym03.mp3"),
        };


        //各イベントを登録
        $scope.startWatch = startWatch;//加速度センサ計測開始イベント
        $scope.stopWatch = stopWatch;//加速度センサ計測終了イベント
        $scope.audio_play = audio_play;//一時的にクリックイベントを付与

        /*
          ・上記のイベント登録について
            1.書式
              $scope.ディレクティブ名 = 関数名;
            2.ディレクティブ名とは
              html内にてng-click等のイベントに設定されている名前
        */

        $scope.onclick = testSound;//クリックイベントテスト用
      }]);
      
      //店舗一覧ページのコントローラ
      module.controller('ShopController', ['$scope', function($scope) {
        console.log("Shop page is ready");
        //AngularJSのディレクティブの書式
        $scope.test = "ここに店舗情報を載せるよ！";
      }]);

      //マップページのコントローラ
      module.controller('MapController', ['$scope', function($scope) {
        console.log("Map page is ready.");
        //AngularJSのディレクティブの書式
        $scope.test = "ここにマップ画像とかを載せるよ！";
      }]);
    //========================/ここにイベントを書く=============================//
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

app.initialize();//以上の設定でアプリを起動


//================以下、関数定義==============//


//================楽器再生==============//
function audio_play() {
  // サウンド再生
  AUDIO_LIST["se00"].play();
  // 次呼ばれた時用に新たに生成
  AUDIO_LIST["se00"] = new Audio( AUDIO_LIST["se00"].src );
  //audio.play();
  console.log("play sound now!");
}
//================end/楽器再生==============//

//================加速度センサ機能==============//
function startWatch() {  
  // Update acceleration every 3 seconds
  var options = { frequency: 300 };
  watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
  //watchID = navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
}

// Stop watching the acceleration
function stopWatch() {
  if (watchID) {
    navigator.accelerometer.clearWatch(watchID);
    watchID = null;
  }
}
function onSuccess(acceleration) {
    var acc = acceleration;
    var num = {"x": 10, "y": 15, "z": 15};
    if (Math.abs(acc.x) > num["x"] ||
        Math.abs(acc.y) > num["y"] ||
        Math.abs(acc.z) > num["z"]
    ) {
		  audio_play();
    }
    /*
    alert('Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n');
    */
}

function onError() {
    alert('onError!');
}

//================/加速度センサ機能==============//


//================/一時的にタップで音を出す==============//
//================一時的にタップで音を出す==============//
function sound() {
    //この中に音を鳴らす処理を書く
    //今は一時的にalert
    alert("音がなったよ");
}
//================/一時的にタップで音を出す==============//


function testSound() {
  alert("ok");
}