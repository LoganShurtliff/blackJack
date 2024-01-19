const buttonDeal = document.querySelector('#deal');
const buttonHold = document.querySelector('#hold');
const buttonHit = document.querySelector('#hit');


const playerDiv = document.querySelector('.player');
const dealerDiv = document.querySelector('.dealer');
const playerScoreP = document.querySelector('.playerScore');
const dealerScoreP = document.querySelector('.dealerScore');


//Event Listeners for all the buttons
buttonDeal.addEventListener('click', () => {
    Deal();
});




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

    let dealerHand = [shuffledDeck[deckPosition]];
    let playerHand = [shuffledDeck[deckPosition + 1], shuffledDeck[deckPosition + 2]]

    updateUI(dealerHand, playerHand);

    buttonHit.classList.remove('hidden');
    buttonHold.classList.remove('hidden');


    buttonHit.addEventListener('click', () => {
        Hit(playerHand, dealerHand);
    });

    buttonHold.addEventListener('click', () => {
        Hold();
    });


    deckPosition += 3;
};

//updates the UI
const updateUI = (dealer, player) => {
    dealerDiv.innerHTML = '';
    playerDiv.innerHTML = '';
    
    dealer.forEach(card => {
        let html = `<img src="imgs/${card}.svg">`;
        dealerDiv.innerHTML += html;
    });

    player.forEach(card => {
        let html = `<img src="imgs/${card}.svg">`;
        playerDiv.innerHTML += html;
    });

    playerScoreP.textContent = `Player score = ${calcScore(player)}`;
    dealerScoreP.textContent = `Dealer score = ${calcScore(dealer)}`;
};

// returns either the score, or an array of possible scores (if aces are involved)
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
        return possibleScores;
    } else {
        let total = 0;
        hand.forEach(card => {
            total += checkValue(card);
        });
        return total;
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

const Hit = (who, other) => {
    who.push(shuffledDeck[deckPosition]);
    deckPosition++;

    if (who.length == 1) {
        updateUI(who, other);
    } else {
        updateUI(other, who);
    }
}