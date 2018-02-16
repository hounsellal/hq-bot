var getAllPages = require('./getAllPages');

module.exports = function(questionUrl, answerUrlArray) {
    
    return new Promise(async(resolve, reject)=>{

        var googleBase = "https://www.google.ca/search?q=";
        var wikipediaBase = "https://en.wikipedia.org/wiki/";
        var yahooBase = "https://ca.search.yahoo.com/search?ei=UTF-8&nojs=1&p=";
        var useWikipedia = true;

        var pages = [
            googleBase + questionUrl,
            // googleBase + questionMainWords + " " + answerArray[0],
            // googleBase + questionMainWords+ " " + answerArray[1],
            // googleBase + questionMainWords + " " + answerArray[2],
            googleBase + questionUrl + answerUrlArray.join(" "),
            wikipediaBase + answerUrlArray[0],
            wikipediaBase + answerUrlArray[1],
            wikipediaBase + answerUrlArray[2],
            //yahooBase + question,
            // yahooBase + questionMainWords + " " + answerArray[0],
            // yahooBase + questionMainWords+ " " + answerArray[1],
            // yahooBase + questionMainWords + " " + answerArray[2],
            // yahooBase + questionMainWords + answerArray.join(" "),
        ];


        var pageIndex = [
            'google question',
            'google question + answers',
            'wikipedia A',
            'wikipedia B',
            'wikipedia C'
        ];

        var wikipediaIndex = -3;
        var pagesArray;

        try{
            pagesArray = await getAllPages(pages);
        } catch(e){
            console.log("wikipedia error");
            pages.splice(wikipediaIndex,3);
            pagesArray = await getAllPages(pages);
            useWikipedia = false;
        }

        var ret = {
            pages: {},
            useWikipedia: useWikipedia
        };

        var n = 0;
        while(n < pageIndex.length){
            ret.pages[pageIndex[n]] = pagesArray[n];
            n+=1;
        }

        resolve(ret);
    });

}