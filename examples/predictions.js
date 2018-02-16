var predictAnswers = require('../functions/predictAnswers');

var qas = [
    {
        question: 'What is Superman’s biggest weakness?',
        category: 'Movies',
        answers: 
         [ { answerId: 81952, text: 'Tickling' },
           { answerId: 81953, text: 'Chocolate' },
           { answerId: 81954, text: 'Kryptonite' } ],
    },
    {
        question: 'The fleshy lower portion of the outer ear is called what?',
        category: 'Nature',
        answers: 
         [ { answerId: 81955, text: 'Ear lobe' },
           { answerId: 81956, text: 'Earwolf' },
           { answerId: 81957, text: 'Ear chin' } ],
    },
    {
        question: 'How do bacteria reproduce?',
        category: 'Science ',
        answers: 
         [ { answerId: 81958, text: 'Binary fission' },
           { answerId: 81959, text: 'Illegal collusion' },
           { answerId: 81960, text: 'Nuclear fusion' } ],
    },
    {
        question: 'What is the official currency of China?',
        category: 'Geography',
        answers: 
         [ { answerId: 81961, text: 'Renminbi' },
           { answerId: 81962, text: 'Yen' },
           { answerId: 81963, text: 'Chinese dollar' } ],
    },
    {
        question: 'Which of these is a real video game?',
        category: 'Science ',
        answers: 
         [ { answerId: 81964, text: 'NFL Blitz' },
           { answerId: 81965, text: 'NBA Slam' },
           { answerId: 81966, text: 'MLB Hits' } ],
    },
    {
        question: 'Who was the first woman ever nominated for a Best Director Oscar?',
        category: 'Entertainment',
        answers: 
         [ { answerId: 81967, text: 'Sofia Coppola' },
           { answerId: 81968, text: 'Jane Campion' },
           { answerId: 81969, text: 'Lina Wertmüller' } ],
    },
    {
        question: 'Which artist is known for paintings of swimming pools?',
        category: 'Art & Design',
        answers: 
         [ { answerId: 81970, text: 'Frank Stella' },
           { answerId: 81971, text: 'David Hockney' },
           { answerId: 81972, text: 'Ólafur Elíasson' } ],
    },
    {
        question: 'Who was the first president to use electricity in the White House?',
        category: 'History',
        answers: 
         [ { answerId: 81973, text: 'Calvin Coolidge' },
           { answerId: 81974, text: 'Benjamin Harrison' },
           { answerId: 81975, text: 'William Howard Taft' } ],
    },
    {
        question: 'What program became the foundation of Apple\'s ubiquitous music library software?',
        category: 'Tech',
        answers: 
         [ { answerId: 81976, text: 'SoundJam MP' },
           { answerId: 81977, text: 'Napster' },
           { answerId: 81978, text: 'Limewire' } ],
    },
    {
        question: 'What existing WNBA team has won the most championships?',
        category: 'Sports',
        answers: 
         [ { answerId: 81979, text: 'Minnesota Lynx' },
           { answerId: 81980, text: 'Los Angeles Sparks' },
           { answerId: 81981, text: 'Houston Comets' } ],
    },
    {
        question: 'None of the members of Wilson Phillips have parents in which of these bands?',
        category: 'Music',
        answers: 
         [ { answerId: 81982, text: 'The Mamas & the Papas' },
           { answerId: 81983, text: 'The Honeys' },
           { answerId: 81984, text: 'The Monkees' } ],
    },
    {
        question: 'Which fast food sandwich was invented most recently?',
        category: 'Food & Drink',
        answers: 
         [ { answerId: 81985, text: 'Whopper' },
           { answerId: 81986, text: 'Filet-O-Fish' },
           { answerId: 81987, text: 'Big Mac' } ],
    }
];

(async function(){

    for(let qa of qas){
        await predictAnswers(qa.question, qa.answers);
        await delay(5);
    }

    let question = "How is the first name of the lead actor of “The English Patient” pronounced?";
    let answers = [ 
        { answerId: 69080, text: '“Rolf”' },
        { answerId: 69081, text: '“Rafe”' },
        { answerId: 69082, text: '“Ralf”' } 
    ];

    let prediction = await predictAnswers(question, answers);
    await delay(5);

    question = "Zebras are native to which continent?";
    answers = [
        {text: "Africa"},
        {text: "Antarctica"},
        {text: "North America"}
    ];

    prediction = await predictAnswers(question, answers);
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
    await delay(5);

    question = 'Which cocktail contains cognac, Cointreau and lemon juice?';
    answers  = [
        {text: 'Sidecar'},
        {text: 'Long Island Iced Tea'},
        {text: 'Manhattan'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'What filmmaker has actually beat up some of his critics in a boxing ring?';
    answers  = [
        {text: 'Michael Bay'},
        {text: 'Uwe Boll'},
        {text: 'Quentin Tarantino'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'Pierre Cardin was born in what country?';
    answers  = [
        {text: 'France'},
        {text: 'Belgium'},
        {text: 'Italy'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'According to its creator, which of these games was secretly designed as a stage play?';
    answers  = [
        {text: 'Super Mario Bros. 3'},
        {text: 'Assassin\'s Creed'},
        {text: 'Metroid Prime'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = '“The Gift,” “The Eye,” and “The Defense” are novels by which notable author?';
    answers  = [
        {text: 'Vladimir Nabokov'},
        {text: 'Herman Melville'},
        {text: 'John Steinbeck'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'The name of which common herb is taken from a Greek word connoting royalty?';
    answers  = [
        {text: 'Cilantro'},
        {text: 'Coriander'},
        {text: 'Basil'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'Which of these dictators was in office the longest?';
    answers  = [
        {text: 'Muammar Gaddafi'},
        {text: 'Robert Mugabe'},
        {text: 'Saddam Hussein'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);    
    
    question = 'The “izzle” slang, made popular by Snoop Dogg, first appeared in which of these songs?';
    answers  = [
        {text: 'Double Dutch Bus'},
        {text: 'Who Am I/What\'s My Name'},
        {text: 'Roxanne, Roxanne'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

    question = 'The First Transcontinental Railroad was previously known as what?';
    answers  = [
        {text: 'Western Route Railroad'},
        {text: 'Overland Route Railroad'},
        {text: 'Great Pacific Railroad'}
    ];
    prediction = await predictAnswers(question, answers);
    await delay(5);

})();

function delay(seconds){
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}


