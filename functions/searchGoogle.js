var rp = require('request-promise');
var cheerio = require('cheerio');

module.exports = function(phrase) {
    return new Promise(async(resolve, reject) => {
        rp('https://www.google.ca/search?q=' + phrase).then(function (htmlString) {
            // Process html...
            resolve(htmlString);
        })
        .catch(function (err) {
            // Crawling failed...
            resovle({error: true, message: err});
        });
    });
}