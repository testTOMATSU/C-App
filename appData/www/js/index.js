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
var page_name = "m_music";//メニューバーの現在ページ

var vector = {"x": true, "y": true, "z": true};//振った方向判定
var vct_ignore = false;//前回振り方向と前々回振り方向が被ったかの判定

//加速度初期値
var pre_acc = {"x": 0, "y": 9, "z": 3, "v": "x"};//x軸,y軸,z軸,加速度最大軸
var bt_border = {0:false,1:false,2:false,3:false};//楽器ボタンのcss変更用

var watchID = null;//加速度センサのID

var curr_inst = null;//現在の楽器
var save_inst = null;//楽器選択情報($event)の退避先
var save_num = null;//css情報の退避先

var switcher = true;//連続して楽器がなるのを防止する

AUDIO_CRRENT = null;//再生用のAUDIOオブジェクト

//楽器音声リスト
AUDIO_LIST = {
  "se00": null,
  "se01": null,
  "se02": null,
  "se03": null, 
  "se04": null,
  "se05": null,
  "se06": null,
  "se07": null, 
  "se08": null,
  "se09": null,
  "se10": null,
};
//楽器音声リスト
/*
var AUDIO_LIST = {
  "se00": new Media("sound/cym03.mp3"),
  "se01": new Media("sound/marakasu.mp3"),
  "se02": new Media("sound/tanbarin_1.mp3"),
  "se03": new Media("sound/pafu.mp3"), 
  "se04": new Media("sound/cym03.mp3"),
  "se05": new Media("sound/marakasu.mp3"),
  "se06": new Media("sound/tanbarin_1.mp3"),
  "se07": new Media("sound/pafu.mp3"), 
  "se08": new Media("sound/cym03.mp3"),
  "se09": new Media("sound/marakasu.mp3"),
  "se10": new Media("sound/tanbarin_1.mp3"),
};
*/

//アプリ本体
var app = {
  // Application Constructor
  initialize: function() {
      this.bindEvents();
  },
  load: function(){
    FastClick.attach(document.body);
    //console.log('fastclick適用');
    /*
    for(var i=0; i < AUDIO_LIST.length; i++){
      AUDIO_LIST[i].load();
      //sconsole.log("load");
    }*/
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
      $scope.page_name = page_name;
      $scope.webView = function(url){
        window.open(url, '_system');
      }
      $scope.curr_page = function($event) {
        page_name = $event.target.getAttribute("id");
        $scope.page_name = page_name;
      }
    }]);

    //楽器ページのコントローラ
    module.controller('SoundController', ['$scope', function($scope){
      console.log("Sound page is ready");

      //楽器音を事前読み込み
      /*for(var i=0; i < AUDIO_LIST.length, i++){
        //AUDIO_LIST[i].load();
        console.log("load");
      }*/
      //console.log("load":+AUDIO_LIST);

      if(save_inst != null && save_num != null){
        stopWatch();//楽器P メニュー 楽器Pの手順で戻られたときのため
        startWatch(save_inst,save_num);
      }

      //各イベントを登録
      $scope.startWatch = startWatch;//加速度センサ計測開始イベント
      $scope.stopWatch = stopWatch;//加速度センサ計測終了イベント
      $scope.audio_play = audio_play;//一時的にクリックイベントを付与

      $scope.play_now = bt_border;

      $scope.curr_inst = curr_inst;
      $scope.save_inst = save_inst;
      $scope.save_num = save_num;

      //fooのセリフチェンジ
      var balloon_bool = true;
      var balloon = document.getElementById('balloon');
      setInterval(function(){
        if(balloon_bool){
          balloon.innerHTML = "がっきをタッチ！<br>スマホをふって！";
          balloon_bool = false;
        }else{
          balloon.innerHTML = "ぼくにタッチ！<br>ともだちたくさん！";
          balloon_bool = true;
        }
      },5000);

    }]);
    
    //マップページのコントローラ
    module.controller('MapController', ['$scope', function($scope) {
      console.log("Map page is ready.");
      stopWatch();
      page_name = "map";
      $scope.touch = touch;
    }]);
  
    //キャラ紹介ページのコントローラ
    module.controller('CharacterController', ['$scope', function($scope) {
      console.log("Character page is ready.");
      stopWatch();
      var scope_target = document.getElementById('m_chara');
      var menuScope = angular.element(scope_target).scope();
      //console.log(menuScope);
      menuScope.page_name = 'm_chara';

      var chara1 = document.getElementById("chara_foo");
      var chara2 = document.getElementById("chara_nazo");
      var chara3 = document.getElementById("chara_tori");
      var chara4 = document.getElementById("chara_hiko");
      var chara5 = document.getElementById("chara_jet");
      
      chara1.addEventListener('click', ch1, false);
      chara2.addEventListener('click', ch2, false);
      chara3.addEventListener('click', ch3, false);
      chara4.addEventListener('click', ch4, false);
      chara5.addEventListener('click', ch5, false);

      function ch1(){
        document.getElementById("chara_1").style.display="block";
        document.getElementById("chara_2").style.display="none";
        document.getElementById("chara_3").style.display="none";
        document.getElementById("chara_4").style.display="none";
        document.getElementById("chara_5").style.display="none";
      }
      function ch2(){
        document.getElementById("chara_1").style.display="none";
        document.getElementById("chara_2").style.display="block";
        document.getElementById("chara_3").style.display="none";
        document.getElementById("chara_4").style.display="none";
        document.getElementById("chara_5").style.display="none";
      }
      function ch3(){
        document.getElementById("chara_1").style.display="none";
        document.getElementById("chara_2").style.display="none";
        document.getElementById("chara_3").style.display="block";
        document.getElementById("chara_4").style.display="none";
        document.getElementById("chara_5").style.display="none";
      }
      function ch4(){
        document.getElementById("chara_1").style.display="none";
        document.getElementById("chara_2").style.display="none";
        document.getElementById("chara_3").style.display="none";
        document.getElementById("chara_4").style.display="block";
        document.getElementById("chara_5").style.display="none";
      }
      function ch5(){
        document.getElementById("chara_1").style.display="none";
        document.getElementById("chara_2").style.display="none";
        document.getElementById("chara_3").style.display="none";
        document.getElementById("chara_4").style.display="none";
        document.getElementById("chara_5").style.display="block";
      }
      //AngularJSのディレクティブの書式
      //$scope.test = "公式サイトが表示されます";
      //var ref = window.open('http://www.centrair.jp', '_blank', 'location=yes');
      //ref.addEventListener('loadstart', function() { alert(event.url); });
    }]);

    //プロモーションページのコントローラ
    module.controller('PromotionController', ['$scope', function($scope) {
      console.log("Promotion page is ready.");
      stopWatch();
    }]);
  //========================/ここにイベントを書く=============================//
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');

    //楽器音セット
    AUDIO_LIST = {
      "se00": new Media("sound/cym03.mp3"),
      "se01": new Media("sound/marakasu.mp3"),
      "se02": new Media("sound/tanbarin_1.mp3"),
      "se03": new Media("sound/pafu.mp3"), 
      "se04": new Media("sound/cym03.mp3"),
      "se05": new Media("sound/marakasu.mp3"),
      "se06": new Media("sound/tanbarin_1.mp3"),
      "se07": new Media("sound/pafu.mp3"), 
      "se08": new Media("sound/cym03.mp3"),
      "se09": new Media("sound/marakasu.mp3"),
      "se10": new Media("sound/tanbarin_1.mp3"),
    };

    //読み込みができたならスプラッシュスクリーンを消す
    cordova.exec(null, null, "SplashScreen", "hide", []);
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
  if(AUDIO_CRRENT != null){
    delete AUDIO_CRRENT;
  }
  AUDIO_CRRENT = AUDIO_LIST[curr_inst];
  // サウンド再生
  console.log("audio_play by :"+curr_inst);
  console.log("AUDIO_CRRENT :"+AUDIO_CRRENT);
  if(true){
    AUDIO_CRRENT.play();
    switcher = false;
  }else{
    switcher = true;
  }
  // 次呼ばれた時用に新たに生成
  //AUDIO_CRRENT = new Media(AUDIO_CRRENT.src);
  //audio.play();
  console.log("play sound now!:"+AUDIO_CRRENT.src);
}
//================end/楽器再生==============//

//================加速度センサ機能==============//
function startWatch($event,num) {
 
  //どの楽器ボタンを選択したか取得
  //楽器ボタンからの呼び出しか、ページ遷移での呼び出しか判断
  if(typeof($event) == "string"){
    curr_inst = $event;
  }else{
    curr_inst = $event.target.getAttribute("id");
  }

  console.log("save_inst:"+save_inst);
  console.log("curr_inst:"+curr_inst);

  /*======加速センサ開始・停止======*/
  if(curr_inst == save_inst){//前回と同じ楽器をタップしたなら
    if(watchID != null){//センサが動作中なら
      //センサ停止(前回のセンサをとめる)
      stopWatch();
      //前回楽器のcssクラスを解除
      bt_border[save_num] = false;
      curr_inst = null;
      num = null;
    }else{
      //加速度センサスタート
      var options = { frequency: 300 };
      watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
      //今回楽器にcssクラスを付与
      bt_border[num] = true;
    }
  }else{
    stopWatch();
    //前回楽器のcssクラスを解除
    bt_border[save_num] = false;
    //加速度センサスタート
    var options = { frequency: 300 };
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    //今回楽器にcssクラスを付与
    bt_border[num] = true;
  }
  /*======end/加速センサ開始・停止======*/

  //今回の楽器を次回のために「前回楽器」として保存
  save_inst = curr_inst;
  //同様にcss情報も保存
  save_num = num;
  console.log("watchID:"+watchID);
}

// Stop watching the acceleration
function stopWatch() {
  console.log("stop!");
  navigator.accelerometer.clearWatch(watchID);
  watchID = null;
}

function onSuccess(acceleration) {
  var acc = {"x": acceleration.x, "y": acceleration.y, "z": acceleration.z}; //加速度取得
  var num = {"x": 2.5, "y": 4.5, "z": 4.5}; //振り範囲設定
  var hit = false;  //振り判定
  var max = "x";  //一番振れ幅の大きかった軸
  var abs = {"x": 2.5, "y": 4.5, "z": 4.5}; //加速度の絶対値

  console.log("=====================================");
  console.log("acc['x']:"+acc['x']+"acc['y']:"+acc['y']+"acc['z']:"+acc['z']);

  //前回計測時との差
  var diff = {"x": 0, "y": 0, "z": 0};

  //X軸
  diff["x"] = pre_acc["x"] - acc['x'];
  diff["x"] = Math.abs(diff["x"]);
  //Y軸
  diff["y"] = pre_acc["y"] - acc['y'];
  diff["y"] = Math.abs(diff["y"]);
  //Z軸
  diff["z"] = pre_acc["z"] - acc['z'];
  diff["z"] = Math.abs(diff["z"]);

  //一番振れ幅の大きい軸を特定
  if(diff["x"] > diff["y"] && diff["x"] > diff["z"]){
    max = "x";
    vector["x"] = true;
    vector["y"] = false;
    vector["z"] = false;
  }else if(diff["y"] > diff["x"] && diff["y"] > diff["z"]){
    max = "y";
    vector["x"] = false;
    vector["y"] = true;
    vector["z"] = false;
  }else{
    max = "z";
    vector["x"] = false;
    vector["y"] = false;
    vector["z"] = true;
  }

  //加速度最大軸が前回と異なるなら
  if(pre_acc["v"] == max){
    vector[max] = true; //振り方向は考慮しない(trueにする)
    //vct_ignore = true;
  }else{
    vector[max] = false;
    //vct_ignore = false;
  }

  console.log("diff.x:"+diff["x"]+"diff.y:"+diff["y"]+"diff.z:"+diff["z"]);

  //振れ幅最大値が設定値を超えており、かつ端末が振り下ろされた時、かつ振り方向が違う場合
  if(diff[max] > num[max] &&
     Math.abs(acc[max]) > Math.abs(pre_acc[max]) &&
     vector[max]){

    audio_play();//音を鳴らす

    //diff[pre_acc["v"]]とmaxが同じかどうか
    // ...

    //次回比較用に値をセット
    pre_acc["x"] = acc['x'];
    pre_acc["y"] = acc['y'];
    pre_acc["z"] = acc['z'];
    pre_acc["v"] = max;

  }

  //振れ幅最大値が10を超えていた場合はリセット
  if(Math.abs(pre_acc[max]) > 10){
    pre_acc = {"x": 10, "y": 10, "z": 10, "v": "x"};
  }
  console.log("=====================================");
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

function touch(su){
  document.getElementById("map").style.backgroundImage = "url(img/back0"+su+".png)";
  for(var i = 1;i <= 4;i++){
    document.getElementById("lst"+i).style.display = "none";
    document.getElementById("opa"+i).style.backgroundColor = "black";
    document.getElementById("opa"+i).style.opacity = "0.2";
  }
  document.getElementById("lst"+su).style.display = "block";
  document.getElementById("opa"+su).style.opacity = "0";
}