var rp = require('request-promise');
var countMatches = require('./countMatches');
var countWordIntersections = require('./countWordIntersections');
var cheerio = require('cheerio');

module.exports = function(url, answers) {
    return new Promise(async (resolve, reject) => {
        var page = await rp(url);
        var $ = cheerio.load(page);

        var body = $('body').text().toLowerCase();

        var re = {
            counts: [],
            intersections: []
        }

        for(let answer of answers){
            var aa = answer.toLowerCase();
            re['counts'][answer] = countOccurrences(body, answer);

        }

        console.log(re);

        return resolve(re);

    });
}

function countOccurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
}