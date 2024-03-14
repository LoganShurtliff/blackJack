const buttonDeal = document.querySelector('#deal');
const buttonHold = document.querySelector('#hold');
const buttonHit = document.querySelector('#hit');


const playerDiv = document.querySelector('.player');
const dealerDiv = document.querySelector('.dealer');
const playerScoreP = document.querySelector('.playerScore');
const dealerScoreP = document.querySelector('.dealerScore');
const textPWins = document.querySelector('.playerwins');
const textDWins = document.querySelector('.dealerwins');


//Event Listeners for all the buttons
buttonDeal.addEventListener('click', () => {
    Deal();
});

buttonHit.addEventListener('click', () => {
    Hit();
});

buttonHold.addEventListener('click', () => {
    Hold();
});


let playerHand = [];
let dealerHand = [];
let dealerWins = 0;
let playerWins = 0;

//Full deck of 52 playing cards
const initialDeck = [
    '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
    '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'
];


//Fisher-Yates Shuffle Method
const shuffleDeck = deck => {
    let currentPosition = deck.length, randomPosition;

    while (currentPosition > 0) {

        randomPosition = Math.floor(Math.random() * currentPosition);
        currentPosition--;


        [deck[currentPosition], deck[randomPosition]] = [deck[randomPosition], deck[currentPosition]];
    }

    return deck;
}

//Create global deck and deck position
let shuffledDeck = shuffleDeck(initialDeck);
let deckPosition = 0;


//Checks the value of the card and returns it as a number. FILTER OUT ACES FIRST
const checkValue = card => {
    const regex = /^[JQK1].*$/;
    
    if (regex.exec(card)) {
        return 10;
    } else {
        return Number(card.slice(0, 1));
    }
};



//Checks a given hand to see if it contains any aces. If found, returns an array with the index value of all the aces
const checkAces = hand => {
    let found = 0;
    hand.forEach(card => {
        if (card.slice(0, 1) === 'A') {
           found = true;
        }
    });
    if (found) {
        let indexes = [];
        
        if (!(hand.indexOf('AH') == -1)){
            indexes.push(hand.indexOf('AH'));
        }
        if (!(hand.indexOf('AS') == -1)){
            indexes.push(hand.indexOf('AS'));
        }
        if (!(hand.indexOf('AC') == -1)){
            indexes.push(hand.indexOf('AC'));
        }
        if (!(hand.indexOf('AD') == -1)){
            indexes.push(hand.indexOf('AD'));
        }

        return indexes;
    }  else {
        return null;
    }
};


//Initializes the game
const Deal = () => {
    shuffledDeck = shuffleDeck(initialDeck);
    deckPosition = 0;

    dealerHand = [shuffledDeck[deckPosition]];
    playerHand = [shuffledDeck[deckPosition + 1], shuffledDeck[deckPosition + 2]]

    updateUI();

    buttonHit.classList.remove('hidden');
    buttonHold.classList.remove('hidden');

    deckPosition += 3;
};

//updates the UI
const updateUI = () => {
    dealerDiv.innerHTML = '';
    playerDiv.innerHTML = '';
    
    dealerHand.forEach(card => {
        let html = `<img src="imgs/${card}.svg">`;
        dealerDiv.innerHTML += html;
    });

    playerHand.forEach(card => {
        let html = `<img src="imgs/${card}.svg">`;
        playerDiv.innerHTML += html;
    });

    let playerScore = calcScore(playerHand);
    let dealerScore = calcScore(dealerHand);

    playerScoreP.textContent = `Player score = ${playerScore}`;
    dealerScoreP.textContent = `Dealer score = ${dealerScore}`;

    if (playerScore.length == 0)
    {
        bust();
    }
};

const bust = () => {

    buttonHold.classList.add('hidden');
    buttonHit.classList.add('hidden');

    playerScoreP.textContent = "";
    dealerScoreP.textContent = "You went bust";

    dealerWin();
}

// returns an array of possible scores
const calcScore = hand => {
    if (!(checkAces(hand) == null)) {
        let total = 0;
        let aceCount = checkAces(hand).length;
        hand.forEach(card => {
            if (!(isAce(card, hand))){
                total += checkValue(card);
            }
        });

        let possibleScores = formatPossibilities(aceCount, total);
        let validScores = possibleScores.filter(score => score <= 21);
        return validScores;
    } else {
        let total = 0;
        hand.forEach(card => {
            total += checkValue(card);
        });
        let possibleScores = [total];
        let validScores = possibleScores.filter(score => score <= 21);
        return validScores;
    }
};


//Checks whether the given card is an ace, then returns true or false
const isAce = (card, hand) => {
    let found = false;
    checkAces(hand).forEach(index => {
        if (card == hand[index]) {
            found = true;
        }
    });

    return found;
};

//Turns the total score and the number of aces into an array of possible scores
const formatPossibilities = (Count, total) => {
    let posssibilities = [];

    switch (Count) {
        case 1:
            posssibilities = [total + 1, total + 11];
            break;
        case 2:
            posssibilities = [total + 2, total + 12];
            break;
        case 3:
            posssibilities = [total + 3, total + 13];
            break;
        case 4:
            posssibilities = [total + 4, total + 14];
            break;
    }

    return posssibilities;
};

//Adds card to the player's hand
const Hit = () => {
    playerHand.push(shuffledDeck[deckPosition]);
    deckPosition++;

    updateUI();
}

//Adds card to the dealer's hand
const dealerHit = () => {
    dealerHand.push(shuffledDeck[deckPosition]);
    deckPosition++;
}

//When the hold button is pressed
const Hold = () => {
    let dealerScore = calcScore(dealerHand);
    let playerScore = calcScore(playerHand);

    //Deals cards to the dealer until something happens
    let continueLoop = true;
    while (continueLoop)
    {
        continueLoop = false;
        
        dealerHit();
        dealerScore = calcScore(dealerHand);

        if (dealerScore[dealerScore.length - 1] < 17) {
            continueLoop = true;
        }else if (dealerScore.length == 2 && dealerScore[dealerScore.length - 1] < 18) {
            continueLoop = true;
        } else if (dealerScore[dealerScore.length - 1] < playerScore[playerScore.length - 1]) {
            continueLoop = true;
        }
    }

    updateUI();

    if (dealerScore.length == 0) { //If the dealer went over 21 and has no valid scores
        playerWin();
    } else if (dealerScore[dealerScore.length - 1] > playerScore[playerScore.length - 1]) {
        dealerWin();
    } else {
        playerWin();
    }
}

const playerWin = () => {
    playerWins++;

    buttonHold.classList.add('hidden');
    buttonHit.classList.add('hidden');

    playerScoreP.textContent = "";
    dealerScoreP.textContent = "You won!";

    textPWins.textContent = playerWins;
    textDWins.textContent = dealerWins;
}

const dealerWin = () => {
    dealerWins++;
    
    buttonHold.classList.add('hidden');
    buttonHit.classList.add('hidden');

    playerScoreP.textContent = "";
    dealerScoreP.textContent = "You lost.";

    textPWins.textContent = playerWins;
    textDWins.textContent = dealerWins;
}