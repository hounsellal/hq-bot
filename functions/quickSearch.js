var config = require('../config.personal.json');
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(config.wolframId);

module.exports = function(searchString, answers = null){
    console.log("\n---------- QUICK SEARCH!!! -----------------\n");
    return new Promise(async(resolve, reject) => {      

        if(answers){
            if(searchString.indexOf("sss") < 0){
                searchString = searchString + " sss";
            }
            var wolfArray = [
                waApi.getShort(searchString.replace("sss", answers[0])),
                waApi.getShort(searchString.replace("sss", answers[1])),
                waApi.getShort(searchString.replace("sss", answers[2]))
            ];
        } else {
            var wolfArray = [
                waApi.getShort(searchString)
            ];
        }

        try{
            var results = await Promise.all(wolfArray);
        } catch(e){
            console.log(e);
            return false;
        }
        
        var n = 0;
        for(let result of results){

            let sss = (answers) ? searchString.replace("sss", answers[n]) : searchString;
            console.log("\nSEARCH FOR: " + sss + " ---------------\n");
            console.log(result);
            n+=1;
        }

        resolve((results.length > 1) ? results : results[0]);

    })
}