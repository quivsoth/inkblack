"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");

const blackjackRules = () => {
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
	const deck = MultiShuffle();
	const isNanOrZero = n => isNaN(n) ? 0 : n
	const rules = yaml.safeLoad(fs.readFileSync("bll/blackjackRules.yml", "utf8"));
	const tally = (cards) => { return cards.map(item => item.cardValue).reduce((a, b) => a + b); }


	const RunPlayer = (playingHand, dealerCard) => {
		let cardTally = tally(playingHand.cards[0]);
		const sorted = playingHand.cards[0].sort(function(a,b){ return ((+b.cardValue==b.cardValue) && (+a.cardValue != a.cardValue)) || (a.cardValue - b.cardValue) }).reverse();
		const handCode = sorted[0].cardValue + "," + sorted[1].cardValue;

		// Check for blackjack
		if(handCode == 'A,10') {
			playingHand.outcome = "BJ";
			return playingHand;
		}

		//Eval the handcode to see the options (all options will have an array)
		let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == (handCode.includes('A') || (sorted[0].cardValue == sorted[1].cardValue) ? handCode : cardTally); });

		//2. hit,split or double?
		const shouldDouble = hitOption[0].Hand.Double.indexOf(dealerCard);
		if (shouldDouble >= 0) {
			playingHand.outcome = "DOUBLE";
			playingHand.cards[0].push(deck.pop());
			return playingHand;
		}

		const shouldSplit = hitOption[0].Hand.Split.indexOf(dealerCard);
		if (shouldSplit >= 0) {
			playingHand.outcome = "SPLIT";
			return playingHand;
		}

		const shouldHit = hitOption[0].Hand.Hit.indexOf(dealerCard);
		if (shouldHit >= 0) AutoRun(sorted, dealerCard);

		cardTally = tally(playingHand.cards[0]);
		// BUST
		if (cardTally > 21) {
			playingHand.outcome = "BUST";
			return playingHand;
		}

		playingHand.outcome = tally(playingHand.cards[0]);
		return playingHand;
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

	const RunDeck = (player, dealer) => {
		let outcome = "";		// push, dealerwin, playerwin (WLP)

		console.log(dealer[0][0].cardFace);

		// Eval
		let playerResult = RunPlayer(Table.players[0].hand, Table.dealer[0][0].cardValue);
		let dealerResult = null;
		if(playerResult.outcome == "BJ") {
			//TODO check against the dealer hand, if no blackjack you win
			outcome = "W";
		} else if(playerResult.outcome == "BUST") outcome = "L";
		else dealerResult = RunDealer(Table.dealer[0], false);

		// console.log(playerResult);
		// console.log(dealerResult);

		// TODO clear out the hand arrays, the outcome + any bets
		//TODO result builder
	}

	try {
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
		var playerCards = [ deck.pop(), deck.pop()];
		var dealerCards = [ deck.pop(), deck.pop()];
		var Table = { players: [], shoeResult: [], dealer: [] }
		var player1 = { name: "Ximeng Liu", cash: 0, hand: { cards: [], outcome: "", bet: 0} }

		Table.players.push(player1);				// Add player to the table
		player1.hand.cards.push(playerCards);		// Deal first hand to the player
		Table.dealer.push(dealerCards);				// Deal to the dealer
		RunDeck(Table.players[0], Table.dealer);	//review the outcome
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
	} catch (e) {
		console.log(e);
	}
}
blackjackRules();
module.exports = blackjackRules;


// bugs
// A/7 didnt hit?