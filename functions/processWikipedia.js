var sw = require('stopword');
var rp = require('request-promise');
var cheerio = require('cheerio');

module.exports = function(wikiPage, searchString){
    
    var res = [];

    let $ = cheerio.load(wikiPage);
    try{
        let wikiText = $("#bodyContent").text();
    } catch(e) {
        return false;
    }
    

    searchWords = searchString.split(" ");

    let oc = 0;
    let ret = {};

    for(let searchWord of searchWords){
        let wordOcurrences = countOcurrences(wikiText, searchWord);
        oc += wordOcurrences;
        ret[searchWord] = wordOcurrences;
    }

    ret['total'] = oc;

    return ret;


}


function countOcurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
}