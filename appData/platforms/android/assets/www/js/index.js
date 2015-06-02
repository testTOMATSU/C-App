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
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    //========================ここにイベントを書く=============================//
        app.receivedEvent('deviceready');
        $(function(){
        
            /*一時的にコメントアウト
            //加速度センサ計測開始イベント
            var start = document.getElementById('start');
            start.addEventListener("click", startWatch, false);
            //加速度センサ計測終了イベント
            var stop = document.getElementById('stop');
            stop.addEventListener("click", stopWatch, false);
            */
            //一時的にクリックイベントを付与
            //var soundButton = document.getElementById('sound');
            //soundButton.addEventListener("click", sound, false);
            $('#sound').click(sound);
        });
        
    //========================/ここにイベントを書く=============================//
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
//================加速度センサ機能==============//
function startWatch() {

  
  // Update acceleration every 3 seconds
  var options = { frequency: 100 };
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
    var num = 15;
    if (acc.x > num || acc.y > num || acc.z > num) {
      alert('Shake it!');
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
//================一時的にタップで音を出す==============//
function sound() {
    //この中に音を鳴らす処理を書く
    //今は一時的にalert
    alert("音がなったよ");
}
//================/一時的にタップで音を出す==============//