var getAllPages = require('./getAllPages');
var cheerio = require('cheerio');
var colors = require('colors');

module.exports = function(question, answers){

    var googleBase = "https://www.google.ca/search?q=";
    var quicks = [
        googleBase + encodeURI(question + " " + answers[0]),
        googleBase + encodeURI(question + " " + answers[1]),
        googleBase + encodeURI(question + " " + answers[2])
    ];

    console.log("\n\nQUICK GOOGLE SEARCH FOR: \"" + question + " [ANSWER]\"\n");

    return new Promise(async(resolve, reject)=>{
        var results = await getAllPages(quicks, true);

        results.forEach((result, index) => {
            //console.log(result);
            var $ = cheerio.load(result);
            var kpHeader = $('div[class="kp-header"]');
            //console.log(kpHeader);

            console.log(("\n------------" + answers[index] + ": --------------------").red);

            if(kpHeader.length){
                console.log(kpHeader.text().split("}").pop().trim().yellow);
            } else {
                var resultSnippets = $('span[class="st"]');
                var snip = resultSnippets.first().text();
                console.log(snip);
            }
            
        });

    })


}