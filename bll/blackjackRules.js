"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");
const { pid } = require("process");

const blackjackRules = () => {
	const rules = yaml.safeLoad(fs.readFileSync("bll/blackjackRules.yml", "utf8"));
	const isNanOrZero = n => isNaN(n) ? 0 : n
	const aceCheck = (hand) => {
		let aces = hand.filter(function (cards) { return cards.cardFace == 'Ace'});
		let noAces = hand.filter(function (cards) { return cards.cardFace != 'Ace'});
		let result = noAces.map(item => item.cardValue).reduce((a, b) => a + b);

		if (aces.length > 0) {
			aces.forEach(card => {
				card.cardValue = 1;
				result += 1;
				if((result + 11) <= 21) {
					card.cardValue += 10;
					result += 10;
				}
			});
		}
	}
	// const dealerRun = (dealerCards) => {
	// 	const hand = {
	// 		hand: dealerCards,
	// 		result: 0
	// 	}

	// 	aceCheck(dealerCards);
	// 	hand.result = dealerCards.map(item => item.cardValue).reduce((a, b) => a + b);

	// 	if (hand.result > 21) return dealerCards;
	// 	if (hand.result < 17) {
	// 		dealerCards.push(deck.pop());
	// 		dealerRun(dealerCards);
	// 	}
	// 	return hand;
	// }
	const RunPlayer = (playerCards, dealerCard) => {
		const result = { tally: 0, hand: [] }
		const cardTally = playerCards[0].map(item => item.cardValue).reduce((a, b) => isNanOrZero(a) + isNanOrZero(b));

		if (playerCards[0].length == 2) {
			const sorted = playerCards[0].sort(function(a,b){ return ((+b.cardValue==b.cardValue) && (+a.cardValue != a.cardValue)) || (a.cardValue - b.cardValue) }).reverse();
			const handCode = sorted[0].cardValue + "," + sorted[1].cardValue;

			// 1. check for blackjack
			if(handCode == 'A,10') { result.tally = "BJ" }

			//Eval the handcode to see the options (all options will have an array)
			let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == (handCode.includes('A') || (sorted[0].cardValue == sorted[1].cardValue) ? handCode : cardTally); });


			//2. hit,split or double?
			const shouldDouble = hitOption[0].Hand.Double.indexOf(dealerCard);
			if (shouldDouble >= 0) { console.log("Action: Double");}

			const shouldSplit = hitOption[0].Hand.Split.indexOf(dealerCard);
			if (shouldSplit >= 0) { console.log("Action: Split");}

			const shouldHit = hitOption[0].Hand.Hit.indexOf(dealerCard);
			if (shouldHit >= 0) {
				console.log("Action: Hit");
				//TODO we are here
			}

			if (shouldDouble == -1 && shouldHit == -1 && shouldSplit == -1) { console.log("Action: Stay"); }
		}
		result.tally = playerCards[0].map(item => item.cardValue).reduce((a, b) => a + b);
		result.hand.push(playerCards[0]);
		return result;
	}
	const AutoRunOut = (playerCards, dealerCard) => {
		console.log("dealerCard: " + dealerCard);
		aceCheck(playerCards);
		const cardTally = playerCards.map(item => item.cardValue).reduce((a, b) => isNanOrZero(a) + isNanOrZero(b));
		console.log("Card Tally: " + cardTally);
		if (cardTally > 21) { console.log("Bust."); return; }

		//check for ace

		//if soft 7 or less

		//if soft 8 - eval against dealer card

		//if soft 9 or higher, stand

		let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == cardTally});
		const shouldHit = hitOption[0].Hand.Hit.indexOf(dealerCard);

		// const supervariable = n => n == 10 ? n : (n--, console.log(n), supervariable(n))

		if (shouldHit >= 0) {
			console.log("Action: Hit");
			playerCards.push(deck.pop());
			AutoRunOut(playerCards, dealerCard);
		}
		return playerCards;
	};


	try {
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-


		// Deck Shuffle
		const deck = MultiShuffle();

		var playerCards = [ deck.pop(), deck.pop()];
		var dealerCards = [ deck.pop(), deck.pop()];

		var Table = {
			players: [],
			shoeResult: [],
			dealer: []
		}

		var player1 = {
			name: "Ximeng Liu",
			money: 0,
			hand: []
		}

		// Add player to the table
		Table.players.push(player1);

		// Deal first hand to the player
		player1.hand.push(playerCards);

		// Deal to the dealer
		Table.dealer.push(dealerCards);

		// Eval
		var result = RunPlayer(Table.players[0].hand, dealerCards[0].cardValue);
		// console.log(result.tally);
		// console.log(result.hand);
		//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

	} catch (e) {
		console.log(e);
	}
}

blackjackRules();
module.exports = blackjackRules;