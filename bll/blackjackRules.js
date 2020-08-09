"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");

const blackjackRules = () => {};

const setSoft = (n) => {
	//messy - look at all cards in the playerHand - how to deal with multi-aces?
	return 11;
}

// const oneOrEleven = n => isNaN(n) ? setSoft(n) : n
const isNanOrZero = n => isNaN(n) ? 0 : n

try {
	const rules = yaml.safeLoad(fs.readFileSync("bll/blackjackRules.yml", "utf8"));

	// Deck Shuffle
	const deck = MultiShuffle();

	// Hands
	const card1 = { cardValue: 2 };
	const card2 = { cardValue: 2};
	const card3 = { cardValue: 5 };

	let playerHand = [ deck.pop(),  deck.pop()];
	let dealerHand = [ deck.pop(), deck.pop()];

	const FirstPlay = (playerHand, dealerCard) => {
		const cardTally = playerHand.map(item => item.cardValue).reduce((a, b) => isNanOrZero(a) + isNanOrZero(b));

		if (playerHand.length == 2) {
			playerHand.sort(function(a,b){ return ((+b.cardValue==b.cardValue) && (+a.cardValue != a.cardValue)) || (a.cardValue - b.cardValue) }).reverse();
			const handCode = playerHand[0].cardValue + "," + playerHand[1].cardValue;
			console.log("handCode : " + handCode);
			console.log("dealerCard : " + dealerCard);

			// 1. check for blackjack
			if(handCode == 'A,10') {console.log("BLACKJACK!!");}

			//Eval the handcode to see the options (all options will have an array)
			let hitOption = rules.filter(function (cards) { return cards.Hand.PlayerTotal == (handCode.includes('A') || (playerHand[0].cardValue == playerHand[1].cardValue) ? handCode : cardTally); });

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

	const AutoRunOut = (playerHand, dealerCard) => {
		console.log("dealerCard: " + dealerCard);
		// console.log(playerHand);
		playerHand.forEach(element => {
			console.log(element.cardValue);
		});

		const cardTally = playerHand.map(item => item.cardValue).reduce((a, b) => isNanOrZero(a) + isNanOrZero(b));
		console.log("cardTally: " + cardTally);
	};

	//Play(playerHand, dealerHand[0].cardValue);
	FirstPlay(playerHand, dealerHand[0].cardValue);


} catch (e) {
	console.log(e);
}
module.exports = blackjackRules;