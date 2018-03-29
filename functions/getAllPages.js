var rp = require('request-promise');

module.exports = function (pageArray, chromeHeaders = false) {

    var functionArray = pageArray.map(page => {
        var o = {url: page}
        if(chromeHeaders) {
            o['headers'] = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
          };
        }
        return getPage(o);
    });

    return Promise.all(functionArray);
}

function getPage(o){
    return new Promise(async(resolve, reject)=>{
        try{
            var page = await rp(o);
            resolve(page);
        }catch(e){
            resolve("<html></html>");
        }

    })
}