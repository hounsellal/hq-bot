var rp = require('request-promise');

module.exports = function (pageArray) {
    var functionArray = pageArray.map(page => {
        return rp(page);
    });

    return Promise.all(functionArray);
}