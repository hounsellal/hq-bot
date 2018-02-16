var prompt = require('prompt');
prompt.start();
var quickSearch = require('./functions/quickSearch');
const say = require('say');

searchPrompt();


function searchPrompt(){
    prompt.get(['searchString'], function (err, result) {

        var ss = result.searchString;
        
        if(ss != "exit" ) {
            quickSearch(ss).then(a => {
                say.speak(a);
            });

            searchPrompt();
        }
    });
}