var processGoogleResults = require('./processGoogleResults');
var searchGoogle = require('./searchGoogle');
var countMatches = require('./countMatches');
var pluralize = require('pluralize');
var processWikipedia = require('./processWikipedia');
var getAllPages = require('./getAllPages');
var sw = require('stopword');

module.exports = function(question, answers) {

    return new Promise(async(resolve, reject) => {

        question = question.split(" ").map(q=>{return pluralize.singular(q); }).join(" ").replace("?", "");
        questionMainWords = sw.removeStopwords(question.split(" ")).join(" ");

        //process.stdout.write('\033c');

        console.log('QUESTION: ', question);

        var answerArray = [];
        for(let answer of answers){
            answerArray.push(answer.text);
        }

        var googleBase = "https://www.google.ca/search?q=";
        var wikipediaBase = "https://en.wikipedia.org/wiki/";

        var pages = [
            googleBase + question,
            googleBase + questionMainWords + " " + answerArray[0],
            googleBase + questionMainWords+ " " + answerArray[1],
            googleBase + questionMainWords + " " + answerArray[2],
            googleBase + questionMainWords + answerArray.join(" "),
            wikipediaBase + answerArray[0],
            wikipediaBase + answerArray[1],
            wikipediaBase + answerArray[2],
        ];

        pagesArray = await getAllPages(pages);

        console.log("\n----------- GOOGLE METHOD #1: " + question + " ---------------\n");

        var results = processGoogleResults(pagesArray[0]);

        var answerGoogleWeighting = {
            a: countMatches(results, answerArray[0]),
            b: countMatches(results, answerArray[1]),
            c: countMatches(results, answerArray[2])
        };

        console.log("\n--------- GOOGLE METHOD #2: " + questionMainWords + " [SINGLE CHOICE] ----------------\n")


        var answerGoogle2Weighting = {
            a: countMatches(processGoogleResults(pagesArray[1]), answerArray[0]),
            b: countMatches(processGoogleResults(pagesArray[2]), answerArray[1]),
            c: countMatches(processGoogleResults(pagesArray[3]), answerArray[2]),
        }

        console.log("\n----------- GOOGLE METHOD #3: " + questionMainWords + " " + answerArray.join(" ") + " ---------------\n");

        var answerGoogle3Weighting = {
            a: countMatches(processGoogleResults(pagesArray[4]), answerArray[0]),
            b: countMatches(processGoogleResults(pagesArray[4]), answerArray[1]),
            c: countMatches(processGoogleResults(pagesArray[4]), answerArray[2]),
        };

        var total = answerGoogleWeighting.a + answerGoogleWeighting.b + answerGoogleWeighting.c + answerGoogle2Weighting.a + answerGoogle2Weighting.b + answerGoogle2Weighting.c + answerGoogle3Weighting.a + answerGoogle3Weighting.b + answerGoogle3Weighting.c;

        var finalAnswer = {};

        finalAnswer.a = Math.round(100 * (answerGoogleWeighting.a + answerGoogle2Weighting.a + answerGoogle3Weighting.a) / total);
        finalAnswer.b = Math.round(100 * (answerGoogleWeighting.b + answerGoogle2Weighting.b + answerGoogle3Weighting.b) / total);
        finalAnswer.c = Math.round(100 * (answerGoogleWeighting.c + answerGoogle2Weighting.c + answerGoogle3Weighting.c) / total);

        console.log("\nFinal Total: ", finalAnswer);

        console.log("\n------------- WIKIPEDIA PAGES ----------------\n");

        console.log(answerArray[0] + ": " + JSON.stringify(processWikipedia(pagesArray[5], questionMainWords), null, 2));
        console.log(answerArray[1] + ": " + JSON.stringify(processWikipedia(pagesArray[6], questionMainWords), null, 2));
        console.log(answerArray[2] + ": " + JSON.stringify(processWikipedia(pagesArray[7], questionMainWords), null, 2));

        resolve(answerGoogleWeighting);

    });
}