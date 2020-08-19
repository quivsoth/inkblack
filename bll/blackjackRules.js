"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");

const blackjackRules = () => {
	const rules = yaml.safeLoad(fs.readFileSync("bll/blackjackRules.yml", "utf8"));
	const deck = MultiShuffle();
	const isNanOrZero = n => isNaN(n) ? 0 : n
	const tally = (cards) => { return cards.map(item => item.cardValue).reduce((a, b) => a + b); }
	const aceCheck = (hand) => {
		let hasAce = false;
		let aces = hand.filter(function (cards) { return cards.cardFace == 'Ace'});
		let noAces = hand.filter(function (cards) { return cards.cardFace != 'Ace'});
		let result = noAces.map(item => item.cardValue).reduce((a, b) => a + b);

		if (aces.length > 0) {
			hasAce = true;
			aces.forEach(card => {
				card.cardValue = 1;
				result += 1;
				if((result + 10) <= 21) {
					card.cardValue += 10;
					result += 10;
				}
			});
		}
		return hasAce;
	}

	const RunPlayer = (playingCards, dealerCard) => {
		const cardTally = tally(playingCards);
		const sorted = playingCards.sort(function(a,b){ return ((+b.cardValue==b.cardValue) && (+a.cardValue != a.cardValue)) || (a.cardValue - b.cardValue) }).reverse();
		const handCode = sorted[0].cardValue + "," + sorted[1].cardValue;

		// Check for blackjack
		if (cardTally > 21) { return playingCards; }

		// Check for blackjack
		if(handCode == 'A,10') { return playingCards; }

		//Eval the handcode to see the options (all options will have an array)
		let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == (handCode.includes('A') || (sorted[0].cardValue == sorted[1].cardValue) ? handCode : cardTally); });

		//2. hit,split or double?
		const shouldDouble = hitOption[0].Hand.Double.indexOf(dealerCard);
		if (shouldDouble >= 0) {
			console.log("Action: DOUBLE");
			playingCards.push(deck.pop());
			return playingCards;
		}

		const shouldSplit = hitOption[0].Hand.Split.indexOf(dealerCard);
		if (shouldSplit >= 0) {
			console.log("Action: SPLIT");
			return playingCards;
		}

		const shouldHit = hitOption[0].Hand.Hit.indexOf(dealerCard);
		if (shouldHit >= 0) {
			console.log("Action: HIT");
			AutoRun(sorted, dealerCard);
		}
		return playingCards;
	}

	const RunDealer = (dealerCards, soft17) => {
		const hasAce = aceCheck(dealerCards);
		const cardTally = tally(dealerCards);
		if((cardTally <= 16) || (soft17 && hasAce && cardTally == 17)) {
			dealerCards.push(deck.pop());
			RunDealer(dealerCards);
		}
		return dealerCards;
	}

	const AutoRun = (cards, dealerCard) => {
		const hasAce = aceCheck(cards);
		const cardTally = tally(cards);
		if (cardTally > 21) { return cards; }

		//if soft 7 or less
		if(hasAce && cardTally <=7 ) {
			cards.push(deck.pop());
			AutoRun(cards, dealerCard);
		}

		//if soft 8 - eval against dealer card
		if(hasAce && cardTally == 8 ) //todo this will depend on the face card the dealer has

		//if soft 9 or higher, stand
		if(hasAce && cardTally >= 9 ) return cards;

		let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == cardTally});
		const shouldHit = hitOption[0].Hand.Hit.indexOf(dealerCard);
		if (shouldHit >= 0) {
			cards.push(deck.pop());
			AutoRun(cards, dealerCard);
		}

		return cards;
	};

	const WhoWon = (playerHand, dealerHand) => {

		//
		const playerTotal = tally(playerHand);
		const dealerTotal = tally(dealerHand);
		var result = { }
		console.log(playerHand);
		console.log(dealerHand);
	}

	try {
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		var playerCards = [ deck.pop(), deck.pop()];
		var dealerCards = [ deck.pop(), deck.pop()];
		var Table = { players: [], shoeResult: [], dealer: [] }
		var player1 = { name: "Ximeng Liu", money: 0, hand: [] }

		// Add player to the table
		Table.players.push(player1);

		// Deal first hand to the player
		player1.hand.push(playerCards);

		// Deal to the dealer
		Table.dealer.push(dealerCards);

		// Eval
		const playerResult = RunPlayer(Table.players[0].hand[0], Table.dealer[0][0].cardValue);
		const dealerResult = RunDealer(Table.dealer[0], false);
		let playerTally = tally(playerResult);
		let dealerTally = tally(dealerResult);

		console.log("player: " + playerTally);
		console.log("dealer: " + dealerTally);

		console.log("----");

		if(playerTally > 21) console.log("bust");
		if(playerTally == 21 && playerResult.length == 2) console.log("blackjack");

		// console.log();


		console.log("--");
		// console.log(dealerResult);
		// console.log(runOutPlayer);
		// const runOutDealer = RunDealer(Table.dealer[0], true);
		// console.log(runOutDealer);

		//const result = { tally: 0, isDouble: false, hand: [] }
		// console.log(runOutDealer);

		// console.log(result.tally);
		// console.log(result.hand);
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

	} catch (e) {
		console.log(e);
	}
}






blackjackRules();
module.exports = blackjackRules;





// bugs
// A/7 didnt hit?