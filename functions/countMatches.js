module.exports = function(results, answer){
    var oc = 0;
    for(let result of results){
        oc += countOcurrences(result, answer);
    }

    console.log('Google count for ' + answer + ': ' + oc);
    return oc;
}

function countOcurrences(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
}