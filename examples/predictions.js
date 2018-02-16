var predictAnswers = require('../functions/predictAnswers');
var connection = require('../connection');

(async function(){

    var qas = await connection.pq("SELECT * FROM questions ORDER BY RAND()");

    for(let qa of qas){
        await predictAnswers(qa.question, JSON.parse(qa.answers));
        await delay(5);
    }

    connection.end();

})();

function delay(seconds){
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


