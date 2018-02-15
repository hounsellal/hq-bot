var getAllPages = require('./getAllPages');
var cheerio = require('cheerio');
var config = require('../config.json');
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(config.wolframId);

module.exports = function(searchString, answers){
    console.log("\n---------- QUICK SEARCH!!! -----------------\n");
    return new Promise(async(resolve, reject) => {
        var googleBase = " http://api.wolframalpha.com/v2/query?appid=" + config.wolframId + "&input=";
        if(searchString.indexOf("sss") < 0){
            searchString = searchString + " sss";
        }

        var wolfArray = [
            waApi.getShort(searchString.replace("sss", answers[0])),
            waApi.getShort(searchString.replace("sss", answers[1])),
            waApi.getShort(searchString.replace("sss", answers[2]))
        ];

        var results = await Promise.all(wolfArray);

        for(let num of [0, 1, 2]){
           
            console.log("\nSEARCH FOR: " + searchString.replace("sss", answers[num]) + " ---------------\n");
            var sn = getSnippets(results[num]);
            console.log(sn);
        }

    })
}

function getSnippets(page){
    let res = page;
    return res;
}