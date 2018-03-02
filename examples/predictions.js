var predictAnswers = require('../functions/predictAnswers');
var connection = require('../connection');
var args = require('minimist')(process.argv.slice(2));
console.log(args);

(async function(){

    var searchString = "SELECT * FROM questions ORDER BY RAND() LIMIT 100";
    if(args.id) searchString = "SELECT * FROM questions WHERE id = " + args.id;

    var qas = await connection.pq(searchString);

    for(let qa of qas){
        await predictAnswers(qa.question, JSON.parse(qa.answers));
        if(qa.id > 62) {
            console.log("ANSWER: ", JSON.parse(qa.answers)[qa.correctAnswer].text);
        }
        await delay(5);
    }

    connection.end();

})();

function delay(seconds){
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


