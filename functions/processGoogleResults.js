var cheerio = require('cheerio');

module.exports = function(googleString, yahooString = null){
    var $ = cheerio.load(googleString);

    var results = [];
    var resultTitles = $('h3[class="r"]');
    var resultSnippets = $('span[class="st"]');
    var resultLinks = [];

    resultTitles.each(function(title){

        results.push($(this).text().toLowerCase());
        resultLinks.push("https://www.google.ca" + $(this).find("a").first().attr('href'));
    });

    resultSnippets.each(function(snippet){
        results.push($(this).text().toLowerCase());
    });

    var resultText = $("#resultStats").text();
    numResults = parseInt(resultText.trim().replace("About ", "").replace(/,/g, ''));

    if(yahooString) {
        var $ = cheerio.load(yahooString);

        var results = [];
        var resultParas = $('p');

        resultParas.each(function(para){
            results.push($(this).text().toLowerCase());
        });

    }

    return {total: numResults, results: results, links: resultLinks};
}