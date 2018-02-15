var predictAnswers = require('../functions/predictAnswers');

(async function(){

    let question = "Zebras are native to which continent?";
    let answers = [
        {text: "Africa"},
        {text: "Antarctica"},
        {text: "North America"}
    ];

    let prediction = await predictAnswers(question, answers);
    await delay(5);

    question = "Which vitamin is naturally synthesized in the skin with exposure to the sun?";

    answers = [
        {text: "B6"},
        {text: "D"},
        {text: "C"}
    ];

    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = "Which European country boasts the largest population?";

    answers = [
        {text: "United Kingdom"},
        {text: "France"},
        {text: "Germany"}
    ];

    prediction = await predictAnswers(question, answers);

})();

function delay(seconds){
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


