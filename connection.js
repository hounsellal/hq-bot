const mysql = require('mysql2');
var connection = mysql.createConnection({host:'localhost', user: 'root', database: 'hq-archive'});

connection.pq = function(queryString, queryArray = []) {
    return new Promise(function(resolve, reject) {
        connection.query(queryString, queryArray, function(error, results, fields){
            if(error) console.log( error);
            resolve(results);
        })
    })
}

module.exports = connection;