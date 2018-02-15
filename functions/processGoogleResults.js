var cheerio = require('cheerio');

module.exports = function(htmlString){
    var $ = cheerio.load(htmlString);

    var results = [];
    var resultTitles = $('h3[class="r"]');
    var resultSnippets = $('span[class="st"]');

    resultTitles.each(function(title){

        results.push($(this).text().toLowerCase());
    });

    resultSnippets.each(function(snippet){
        results.push($(this).text().toLowerCase());
    });

    return results;
}