var rp = require('request-promise');
var predictAnswers = require('./functions/predictAnswers');
const WebSocket = require('ws');
var config = require('./config.json');
var prompt = require('prompt');
prompt.start();
var quickSearch = require('./functions/quickSearch');
var quickGoogle = require('./functions/quickGoogle');
var answers = ['Canada', 'United States', 'United Kingdom'];
var question = "What is the capital of Canada?";
var connection = require('./connection');
var moment = require('moment');
var links = [];
var checkAnswersOnPage = require('./functions/checkAnswersOnPage');



searchPrompt();

var headers = {
    'User-Agent': 'hq-viewer/1.2.4 (iPhone; iOS 11.1.1; Scale/3.00)',
    'Authorization' : 'Bearer ' + config.token,
    'x-hq-client'   : 'iOS/1.2.4 b59'
};

(async function(){
    var showDetails = await rp({
        uri: "https://api-quiz.hype.space/shows/now?type=hq",
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
      console.log('Connected');
      //console.log(moment());
      setTimeout(function(){
        console.log("ABOUT TO DISCONNECT IN 5 SECONDS")
      }, 1000 * 25)
    });

    ws.on('close', function open() {
      console.log('Reconnecting...');
      connect(url, headers);
    });

    ws.on('message', async function incoming(data) {

      var message = JSON.parse(data);

        if(message.type == "broadcastEnded" && !message.reason) {
            console.log("Broadcast ended");
            ws.close();
        }

        if(message.type == "question" && message.answers){

            connection.pq("INSERT INTO questions SET ?", {
                questionId: message.questionId,
                question: message.question,
                answers: JSON.stringify(message.answers),
                category: message.category
            });

            answers = processAnswers(message.answers);
            question = message.question;

            links = await predictAnswers(message.question, message.answers);

        }

        if(message.type == "questionSummary") {
            console.log("ANSWER TO QUESTION:");
            //console.log(message);
            var n = 0;
            for(let answer of message.answerCounts){
                if(answer.correct){
                    connection.pq("UPDATE questions SET correctAnswer = ? WHERE questionId = ?", [n, message.questionId]);
                    console.log(answer.answer);
                }
                n+=1;
            }
        }

    });
}

function searchPrompt(){
    prompt.get(['searchString'], function (err, result) {

        var ss = result.searchString;

        //To search for anything during a game just type "/ " followed by your question for Wolfram Alpha
        if(ss.startsWith('/ ')){
            quickSearch(ss.replace("/ ", ""));
            searchPrompt();
            return;
        }

        //To search Wolfram Alpha for the exact HQ questions, just type "/" and enter
        if(ss === "/"){
            quickSearch(question);
            searchPrompt();
            return;
        }

        //Search Google for this question followed by the answers
        if(ss.startsWith('wa ')){
            quickSearch(ss.replace("wa ", ""), answers);
            searchPrompt();
            return;
        }

        if(ss.length == 1 && isNaN(parseInt(ss)) === false) {
            
            var numby = parseInt(ss);
            if(links.links[numby-1]){
                console.log(links.links[numby-1]);
                checkAnswersOnPage(links.links[numby-1], answers);
            }

            searchPrompt();
            return;
        }
        
        //To search for a custom question followed by each of the answers, just type that custom question.
        //the answers will be appended to the end of the question followed by a space
        //if you want the answer to appear mid-sentence then do: "In the capital of sss, how many people are there?"
        // "sss" will be replaced by each of the answers in three separate questions sent to Wolfram Alpha
        if(ss != "exit" ) {
            quickGoogle(ss, answers);
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


