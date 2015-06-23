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

//グローバル変数定義
var inst = "";//前回の楽器
var cur_inst = "";//現在の楽器
var first_sound = true;
var inst_count = {"se00": 0, "se01": 0, "se02": 0, "se03": 0};
var vector = {"x": true, "y": true, "z": true};//振った方向判定

//加速度初期値
var base = {"x": 0, "y": 9, "z": 3, "v": "x"};//x軸,y軸,z軸,加速度最大軸
var bt_border = {0:false,1:false,2:false,3:false};//楽器ボタンのcss変更用
var pre_bt_num;
var watchID = null;
var pre_watchID = null;//ページ移動時に選択楽器を保存しておく

//アプリ本体
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

      //メニューエリアのコントローラ
      module.controller('MenuController', ['$scope', function($scope) {
        console.log("Menu is ready");
      }]);

      //楽器ページのコントローラ
      module.controller('SoundController', ['$scope', function($scope){
        console.log("Sound page is ready");

        //前回のページ離脱時に楽器選択状態だったならwatchIDにセットしなおす
        watchID = pre_watchID;

        first_sound = true;

        //楽器音声リスト
        AUDIO_LIST = {
          "se00": new Audio("sound/cym03.mp3"),
          "se01": new Audio("sound/marakasu.mp3"),
          "se02": new Audio("sound/tanbarin_1.mp3"),
          "se03": new Audio("sound/pafu.mp3"), 
        };


        //各イベントを登録
        $scope.startWatch = startWatch;//加速度センサ計測開始イベント
        $scope.stopWatch = stopWatch;//加速度センサ計測終了イベント
        $scope.audio_play = audio_play;//一時的にクリックイベントを付与

        $scope.play_now = bt_border;//選択楽器CSS
        $scope.watch_id = watchID;

        /*
          ・上記のイベント登録について
            1.書式
              $scope.ディレクティブ名 = 関数名;
            2.ディレクティブ名とは
              html内にてng-click等のイベントに設定されている名前
        */

        //var bt = document.getElementsByClassName('buttons');

      }]);
      
      //店舗一覧ページのコントローラ
      module.controller('ShopController', ['$scope', function($scope) {
        console.log("Shop page is ready");
        pre_watchID = watchID;
        stopWatch();
        //AngularJSのディレクティブの書式
        //$scope.test = "ここに店舗情報を載せるよ！";
      }]);

      //マップページのコントローラ
      module.controller('MapController', ['$scope', function($scope) {
        console.log("Map page is ready.");
        pre_watchID = watchID;
        stopWatch();
        //AngularJSのディレクティブの書式
        $scope.test = "ここにマップ画像が表示されます";
      }]);

      //公式ページのコントローラ
      module.controller('OfficialController', ['$scope', function($scope) {
        console.log("Official page is ready.");
        pre_watchID = watchID;
        stopWatch();
        //AngularJSのディレクティブの書式
        $scope.test = "公式サイトが表示されます";
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
//isset
var isset = function(data){
    if(data === "" || data === null || data === undefined){
        return false;
    }else{
        return true;
    }
};

//================楽器再生==============//
function audio_play() {
  //alert("shake");
  // サウンド再生
  console.log("audio_play by :"+cur_inst);
  console.log("AUDIO_LIST[cur_inst] :"+AUDIO_LIST[cur_inst]);
  AUDIO_LIST[cur_inst].play();
  // 次呼ばれた時用に新たに生成
  AUDIO_LIST[cur_inst] = new Audio( AUDIO_LIST[cur_inst].src );
  //audio.play();
  console.log("play sound now!");
}
//================end/楽器再生==============//

//================加速度センサ機能==============//
function startWatch($event,num) {

  //どの楽器ボタンを選択したか取得
  cur_inst = $event.target.getAttribute("id");
  console.log("親これ"+$event.target.parentNode);

  //前回と今回で楽器が違うなら前回楽器はリセット
  if(inst != cur_inst && inst !== ""){
    inst_count[inst] = 0;
    bt_border[pre_bt_num] = false;
    stopWatch();
  }


  //同じ楽器２回選択で音停止
  if(inst_count[cur_inst]%2 !== 0 && inst !== ""){//楽器タップ回数が奇数階だったら
    console.log("とめるね！");
    stopWatch();
    console.log("かうんと"+inst_count[cur_inst]);
    bt_border[num] = false;
    //設定値もリセット
    base = {"x": 0, "y": 9, "z": 3, "v": "x"};
  }else{//違うなら加速度センサスタート
    console.log("start! by :"+cur_inst);
    console.log("かうんと："+inst_count[cur_inst]);
    var options = { frequency: 40 };
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    first_sound = false;
    //watchID = navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    bt_border[num] = true;
  }

  //タップ回数をcountup
  inst_count[cur_inst]++;

  //前回楽器に現在楽器を設定
  inst = cur_inst;
  pre_bt_num = num;
  console.log(pre_bt_num);
  console.log("play_now["+num+"]:"+bt_border[num]);
  console.log("================================================");
}

// Stop watching the acceleration
function stopWatch(num) {

  if (watchID != null) {
    console.log("stop!");
    navigator.accelerometer.clearWatch(watchID);
    watchID = null;
    //bt_border = {0:false,1:false,2:false,3:false};
  }else{
    console.log("まだ音ならしてないよ");
    pre_watchID = null;
  }
}

function onSuccess(acceleration) {
    var acc = acceleration; //加速度取得
    var num = {"x": 2.5, "y": 4.5, "z": 4.5}; //振り範囲設定
    var hit = false;  //振り判定
    var max = "x";  //一番振れ幅の大きかった軸

    //前回計測時との差
    var diff = {"x": 0, "y": 0, "z": 0};

    //X軸
    if(base["x"] * acc.x >= 0){  //前回値と今回値の正負が一致していたら
      //絶対値で計算
      diff["x"] = Math.abs(base["x"]) - Math.abs(acc.x);
      vector["x"] = false;
    }else{
      //元の値で計算
      diff["x"] = base["x"] - acc.x;
      vector["x"] = true;
    }
    //Y軸
    if(base["y"] * acc.y >= 0){  //前回値と今回値の正負が一致していたら
      //絶対値で計算
      diff["y"] = Math.abs(base["y"]) - Math.abs(acc.y);
      vector["y"] = false;
    }else{
      //元の値で計算
      diff["y"] = base["y"] - acc.y;
      vector["y"] = true;
    }
    //Z軸
    if(base["z"] * acc.z >= 0){  //前回値と今回値の正負が一致していたら
      //絶対値で計算
      diff["z"] = Math.abs(base["z"]) - Math.abs(acc.z);
      vector["z"] = false;
    }else{
      //元の値で計算
      diff["z"] = base["z"] - acc.z;
      vector["z"] = true;
    }

    //一番振れ幅の大きい軸を特定
    if(diff["x"] > diff["y"] && diff["x"] > diff["z"]){
      max = "x";
    }else if(diff["y"] > diff["x"] && diff["y"] > diff["z"]){
      max = "y";
    }else{
      max = "z";
    }

    //加速度最大軸が前回と異なるなら
    if(base["v"] != max){
      vector[max] = true; //振り方向は考慮しない(trueにする)
    }

    //振れ幅最大値が設定値を超えており、なおかつ振り方向が違う場合
    if(diff[max] > num[max] && vector[max]){

      audio_play();//音を鳴らす
      console.log("x:"+diff["x"]+"y:"+diff["y"]+"z:"+diff["z"]);

      //次回比較用に値をセット
      base["x"] = acc.x;
      base["y"] = acc.y;
      base["z"] = acc.z;
      base["v"] = max;
    }

    //振れ幅最大値が20を超えていた場合はリセット
    if(base[max] > 20){
      base = {"x": 0, "y": 9, "z": 3, "v": "x"};
    }
}

function onError() {
    alert('onError!');
}
//================/加速度センサ機能==============//


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