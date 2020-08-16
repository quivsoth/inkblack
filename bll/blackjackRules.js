"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");
const { pid } = require("process");

const blackjackRules = () => {};
const isNanOrZero = n => isNaN(n) ? 0 : n

try {
	const rules = yaml.safeLoad(fs.readFileSync("bll/blackjackRules.yml", "utf8"));

	// Deck Shuffle
	const deck = MultiShuffle();


	let playerCards = [ deck.pop(), deck.pop()];
	let dealerCards = [ deck.pop(), deck.pop()];

	// const supervariable = n => n == 10 ? n : (n--, console.log(n), supervariable(n))

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

	const dealerRun = (dealerCards) => {
		const hand = {
			hand: dealerCards,
			result: 0
		}
		aceCheck(dealerCards);
		hand.result = dealerCards.map(item => item.cardValue).reduce((a, b) => a + b);

		if (hand.result > 21) return dealerCards;
		if (hand.result < 17) {
			dealerCards.push(deck.pop());
			dealerRun(dealerCards);
		}
		return hand;
	}

	const FirstPlay = (playerCards, dealerCard) => {
		const cardTally = playerCards.map(item => item.cardValue).reduce((a, b) => isNanOrZero(a) + isNanOrZero(b));

		if (playerCards.length == 2) {
			playerCards.sort(function(a,b){ return ((+b.cardValue==b.cardValue) && (+a.cardValue != a.cardValue)) || (a.cardValue - b.cardValue) }).reverse();
			const handCode = playerCards[0].cardValue + "," + playerCards[1].cardValue;
			console.log("handCode : " + handCode);
			console.log("dealerCard : " + dealerCard);

			// 1. check for blackjack
			if(handCode == 'A,10') {console.log("BLACKJACK!!");}

			//Eval the handcode to see the options (all options will have an array)
			let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == (handCode.includes('A') || (playerCards[0].cardValue == playerCards[1].cardValue) ? handCode : cardTally); });

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

			if (shouldDouble == -1 && shouldHit == -1 && shouldSplit == -1) { console.log("Action: Stay");}
		}
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



	const aceTest = () => {
		let card1 = {
			id: 2,
			suit: "Hearts",
			cardFace: "Ace",
			cardValue: "A"
		}
		let card2 = {
			id: 12,
			suit: "Spades",
			cardFace: "Three",
			cardValue: 3
		}
		let card3 = {
			id: 24,
			suit: "Hearts",
			cardFace: "Two",
			cardValue: 2
		}
		let card4 = {
			id: 22,
			suit: "Hearts",
			cardFace: "Ace",
			cardValue: "A"
		}
		let card5 = {
			id: 92,
			suit: "Clubs",
			cardFace: "Ace",
			cardValue: "A"
		}

		var p1 = [];
		p1.push(deck.pop(), deck.pop());
		// p1.push(card1, card2, card3, card4);


	}

	aceTest();
	// const gg = AutoRunOut(playerHand, dealerHand[0].cardValue);
	//const gg = dealerRun(dealerHand);
	// console.log(gg);
	//FirstPlay(playerHand, dealerHand[0].cardValue);

} catch (e) {
	console.log(e);
}
module.exports = blackjackRules;