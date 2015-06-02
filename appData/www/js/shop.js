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
        /*$(function(){
            $.ajax({
                url: "https://query.yahooapis.com/v1/public/yql?q=SELECT%20*%20FROM%20html%20WHERE%20url%20%3D%20%22http%3A%2F%2Fwww.centrair.jp%2Fenjoy%2Fshop%2Fcategory01.html%22%20and%20xpath%3D%22%2F%2Fp%5B%40class%3D'name'%5D%22%3B&format=json&diagnostics=true",
                dataType : "jsonp",
                timeout: 7000,
                success: function(json) {
                    console.log("success");
                    console.log(json.query.results.p[0]);
                    alert("success");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
            /*
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });*/
            
            
            
        */});
        
    //========================/ここにイベントを書く=============================//
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

app.initialize();
//================店舗情報読み込み==============//




//================/店舗情報読み込み==============//
