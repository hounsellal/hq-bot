var rp = require('request-promise');
var cheerio = require('cheerio');
var pluralize = require('pluralize');

module.exports = function(wikiPage, searchString){
    
    var res = [];

    let $ = cheerio.load(wikiPage);
    try{
        var wikiText = $("#bodyContent").text().toLowerCase();
    } catch(e) {
        return false;
    }
    

    searchWords = searchString.split(" ");

    let oc = 0;
    let ret = {};
    let missingWords = [];

    for(let searchWord of searchWords){
        //let searchWord = pluralize.singular(sw).replace("’","").replace("'","").toLowerCase();
        let wordOcurrences = countOcurrences(wikiText, searchWord);
        oc += wordOcurrences;
        ret[searchWord] = wordOcurrences;
        if(wordOcurrences == 0) missingWords.push(searchWord);
    }

    ret['total count'] = oc;
    ret['missing words'] = missingWords.join(",");
    ret['has all words'] = (missingWords.length == 0) ? true : false;

    return ret;


}


function countOcurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
}