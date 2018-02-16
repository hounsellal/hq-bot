var processGoogleResults = require('./processGoogleResults');
var searchGoogle = require('./searchGoogle');
var countMatches = require('./countMatches');
var pluralize = require('pluralize');
var processWikipedia = require('./processWikipedia');
var sw = require('stopword');
var colors = require('colors');
var countWordIntersections = require('./countWordIntersections');
var buildPageArray = require('./buildPageArray');
var words = require('lodash.words');
var pluralize = require('pluralize');
var Table = require('cli-table');

module.exports = function(qumero, answers) {

    return new Promise(async(resolve, reject) => {

        var question = qumero.replace("?", "");
        var questionMainWords = sw.removeStopwords(words(question)).map(www=> pluralize.singular(www).replace(/[^a-z0-9]+|\s+/gmi, "").toLowerCase()).join(" ");

        //if you want to clear the scren on mac, use the below
        //process.stdout.write('\033c');

        console.log('\nQUESTION: ', qumero.yellow, "\n");
        var chooseLowest = false;

        if(qumero.indexOf(" NOT ") > -1){
            console.log("NOT DETECTED. CHOOSE THE LOWEST HIT OPTION");
            chooseLowest = true;
        }

        var answerArray = [];
        var answerUrlArray = [];
        for(let answer of answers){
            answerArray.push(answer.text);
            answerUrlArray.push(encodeURI(answer.text));
        }

        var questionUrl = encodeURI(question);

        var pa = await buildPageArray(questionUrl, answerUrlArray);

        var {pages, useWikipedia} = pa;     

        var gh = {
            types: {
                question: {
                    count: [],
                    intersection: [],
                    results: processGoogleResults(pages['google question'])
                },
                questionAnswer: {
                    count: [],
                    intersection: [],
                    results: processGoogleResults(pages['google question + answers'])
                },
            },
            total: [0,0,0]
        };

        for(let key in gh.types){
            var thing = gh.types[key];
            for(let k of [0, 1, 2]){
                let answer = answerArray[k];
                let cm = countMatches(thing.results, answer);
                let cwi = countWordIntersections(thing.results, answer);
                thing.count.push(cm);
                thing.intersection.push(cwi);
            }
            
            delete thing.results;
        }

        gh.clearWinners = {};
        gh.percents = {};
        //consider question matches
        
        var qct = gh.types.question.count.reduce((a, b) => a + b, 0);
        var qit = gh.types.question.intersection.reduce((a, b) => a + b, 0);
        var qact = gh.types.questionAnswer.count.reduce((a, b) => a + b, 0);
        var qait = gh.types.questionAnswer.intersection.reduce((a, b) => a + b, 0);

        gh.percents = {
            question: {
                count: [
                    Math.round(100 * gh.types.question.count[0] / qct || 0),
                    Math.round(100 * gh.types.question.count[1] / qct || 0),
                    Math.round(100 * gh.types.question.count[2] / qct || 0),
                ],
                intersection: [
                    Math.round(100 * gh.types.question.intersection[0] / qit || 0),
                    Math.round(100 * gh.types.question.intersection[1] / qit || 0),
                    Math.round(100 * gh.types.question.intersection[2] / qit || 0),
                ]
            },
            questionAnswer: {
                count: [
                    Math.round(100 * gh.types.questionAnswer.count[0] / qact || 0),
                    Math.round(100 * gh.types.questionAnswer.count[1] / qact || 0),
                    Math.round(100 * gh.types.questionAnswer.count[2] / qact || 0),
                ],
                intersection: [
                    Math.round(100 * gh.types.questionAnswer.intersection[0] / qait || 0),
                    Math.round(100 * gh.types.questionAnswer.intersection[1] / qait || 0),
                    Math.round(100 * gh.types.questionAnswer.intersection[2] / qait || 0),
                ]
            }
        };

        var table = new Table({ head: [colors.bold("GOOGLE SEARCHES"), "A. " + answerArray[0], "B. " + answerArray[1], "C. " + answerArray[2]] });

        table.push(
            { 'METHOD 1 (Search Question, Count Answer Matches)': [gh.percents.question.count[0] + "%", gh.percents.question.count[1] + "%", gh.percents.question.count[2]] },
            { 'METHOD 2 (Search Question, Count Word Intersections)': [gh.percents.question.intersection[0] + "%", gh.percents.question.intersection[1] + "%", gh.percents.question.intersection[2]] },
            { 'METHOD 3 (Search Question & Answers, Count Answer Matches)': [gh.percents.questionAnswer.count[0] + "%", gh.percents.questionAnswer.count[1] + "%", gh.percents.questionAnswer.count[2]] },
            { 'METHOD 4 (Search Queston & Answers, Count Word Intersections)': [gh.percents.questionAnswer.intersection[0] + "%", gh.percents.questionAnswer.intersection[1] + "%", gh.percents.questionAnswer.intersection[2]] },
        );


        var aTotal = 4 * gh.percents.question.count[0] + 3 * gh.percents.question.intersection[0] + 2 * gh.percents.questionAnswer.count[0] + gh.percents.questionAnswer.intersection[0];
        var bTotal = 4 * gh.percents.question.count[1] + 3 * gh.percents.question.intersection[1] + 2 * gh.percents.questionAnswer.count[1] + gh.percents.questionAnswer.intersection[1];
        var cTotal = 4 * gh.percents.question.count[2] + 3 * gh.percents.question.intersection[2] + 2 * gh.percents.questionAnswer.count[2] + gh.percents.questionAnswer.intersection[2];

        
        

        var n = 0;
        var letters = ["A", "B", "C"];
        var tot = 100 * (4 * (qct/qct || 0) + (3 * qit/qit || 0) + (2 * qact/qact || 0) + (qait/qait || 0));

        var finalRow = {
            "Best Guess": []
        };

        for(t of [aTotal, bTotal, cTotal]){
            let ct = Math.round(100 * t/tot);
            var ds = letters[n] + ". " + answerArray[n] + ": " + ct + "%";
            if(!chooseLowest){
                if(t >= aTotal && t >= bTotal && t >= cTotal){
                    finalRow['Best Guess'].push(colors.bgWhite.black(ds));
                } else {
                    finalRow['Best Guess'].push(ds);
                }
            } else {
                if(t <= aTotal && t <= bTotal && t <= cTotal){
                    finalRow['Best Guess'].push(colors.bgWhite.black(ds));
                } else {
                    finalRow['Best Guess'].push(ds);
                }
            }
            
            n+=1;
        }

        table.push(finalRow);

        console.log(table.toString());

        

        if(useWikipedia){
            
            var wikiA = processWikipedia(pages['wikipedia A'], questionMainWords);
            var wikiB = processWikipedia(pages['wikipedia B'], questionMainWords);
            var wikiC = processWikipedia(pages['wikipedia C'], questionMainWords);

            

            var rowArray = [];
            for(let key in wikiA){
                let fo = {};
                let miniArray = [];
                for(let wiki of [wikiA, wikiB, wikiC]){
                    miniArray.push(((wiki[key] == 0) ? colors.red.bold(wiki[key]) : wiki[key]));
                }
                fo[key] = miniArray;
                rowArray.push(fo);
            }

            let aHeader = (wikiA['has all words']) ? colors.bgYellow.black("A. " + answerArray[0]) : "A. " + answerArray[0];
            let bHeader = (wikiB['has all words']) ? colors.bgYellow.black("B. " + answerArray[1]) : "B. " + answerArray[1];
            let cHeader = (wikiC['has all words']) ? colors.bgYellow.black("C. " + answerArray[2]) : "C. " + answerArray[2];

            var wt = new Table({ head: [colors.bold("WIKIPEDIA PAGES"), aHeader, bHeader, cHeader] });
            for(let row of rowArray){
                wt.push(row);
            }

            console.log(wt.toString());
            

        }

        
        

        return resolve(gh);

    });
}

