var words = require('lodash.words');

module.exports = function(results, answer){
    var oc = 0;
    for(let result of results){
        //onsole.log('looking at ' + result);
        oc += countIntersections(result, answer);
    }

    //console.log('Google intersection count for ' + answer + ': ' + oc);
    return oc;
}

function countIntersections(str, value) {
    var strArray = words(str);
    var answerArray = words(value);
    for(let a in answerArray){
        answerArray[a] = answerArray[a].toLowerCase();
    }

    var newArray = strArray.filter(function(n) {

        if(answerArray.join(" ").length > 3){
            for(let answer of answerArray){
                var regExp = new RegExp(answer, "gi");
                return n.match(regExp);
            }
        } else {
            return answerArray.indexOf(n.toLowerCase()) !== -1;
        }

    });

    //console.log(newArray);


    return newArray.length;
}