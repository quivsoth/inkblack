"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");

const aceMe = () => {
     let card1 = {
        id: 2,
        suit: "Hearts",
        cardFace: "Two",
        cardValue: 2
    }
    let card2 = {
        id: 12,
        suit: "Spades",
        cardFace: "Ace",
        cardValue: "A"
    }
    let card3 = {
        id: 2,
        suit: "Hearts",
        cardFace: "Two",
        cardValue: 2
    }
    let card4 = {
        id: 2,
        suit: "Clubs",
        cardFace: "Ace",
        cardValue: "A"
    }
    const deck = MultiShuffle();
    let playerHand = [ card1, card2, card3, card4];
    const hand = { hand: playerHand, result: 0 }

    let aces = playerHand.filter(function (cards) { return cards.cardValue == 'A'});
    let noAces = playerHand.filter(function (cards) { return cards.cardValue != 'A'});
    hand.result = noAces.map(item => item.cardValue).reduce((a, b) => a + b);
    aces.forEach(card => {
        if((hand.result + 11) <= 21) {
            hand.result += 11;
        }
       else { hand.result += 1}
    });

    // 2,3,A,2
    // 7, A



    console.log(hand.result);
    console.log(aces);

}

aceMe();

module.exports = aceMe;