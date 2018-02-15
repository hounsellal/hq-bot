var rp = require('request-promise');
var predictAnswers = require('./functions/predictAnswers');
const WebSocket = require('ws');
var config = require('./config.json');
var prompt = require('prompt');
prompt.start();
var quickSearch = require('./functions/quickSearch');
var answers = ['Canada', 'United States', 'United Kingdom'];

searchPrompt();

var headers = {
    'User-Agent': 'hq-viewer/1.2.4 (iPhone; iOS 11.1.1; Scale/3.00)',
    'Authorization' : 'Bearer ' + config.token,
    'x-hq-client'   : 'iOS/1.2.4 b59'
};

(async function(){
    var showDetails = await rp({
        uri: "https://api-quiz.hype.space/shows/now?type=hq&userId=" + config.userId,
        headers: headers,
        json: true
    });

    console.log("show details:", showDetails);

    if(showDetails.broadcast && showDetails.broadcast.socketUrl){
        connect(showDetails.broadcast.socketUrl, headers);
    }
    
})();

function connect(url, headers){
    var ws = new WebSocket(url.replace("https", "wss"), {
        headers : headers
    });

    ws.on('open', function open() {
      console.log('connected');
    });

    ws.on('close', function open() {
      console.log('Reconnecting');
      connect(url, headers);
    });

    ws.on('message', async function incoming(data) {

      var message = JSON.parse(data);

        if(message.type == "broadcastEnded") {
            console.log("Broadcast ended");
            //ws.close();
        }

        if(message.type == "question"){

            console.log(message);
            processAnswers(message.answers);

            var prediction = await predictAnswers(message.question, message.answers);

            console.log(prediction);
        }

    });
}

function searchPrompt(){
    prompt.get(['searchString'], function (err, result) {
        //
        // Log the results.
        //
        var ss = result.searchString;
        
        if(ss != "exit" ) {
            quickSearch(ss, answers);
            searchPrompt();
        }
    });
}

function processAnswers(answers){
    var aa = [];
    for(let answer of answers){
        aa.push(answer.text);
    }
    answers = aa;
    return aa;
}


