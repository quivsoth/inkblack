"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const MultiShuffle = require("../shuffle");
var MongoClient = require('mongodb').MongoClient;


const match_the_dealer = () => {

    var result = {
        hands: 0,
        match: 0,
        superhands: 0
    }

    const deck = MultiShuffle();

    var playerHand = [];
    // var player2Hand = [];
    // var player3Hand = [];
    var dealerHand = [];

    const match = (dealer, player) => {
        if(dealer.cardFace == player.cardFace) {
            if(dealer.suit == player.suit) {
                // console.log("SUPER Match : " + dealer.cardFace + " | " + player.cardFace);
                result.supermatch++;
                return;
            }
            result.match++;
            // console.log("Match Found : " + dealer.cardFace + " of " + dealer.suit + " | " + player.cardFace + " of " + player.suit);
        }
    }

    const Play = () => {
        result.hands++;
        if(deck.length < 30) {
            // console.log(result.hands);
            return result;
        }
        playerHand = [ deck.pop(), deck.pop()];
        // player2Hand = [ deck.pop(), deck.pop()];
        // player3Hand = [ deck.pop(), deck.pop()];
        dealerHand = [ deck.pop(), deck.pop()];
        // console.log("--");
        // console.log(dealerHand[0]);
        // console.log(playerHand[0]);
        // console.log(playerHand[1]);
        // console.log("--");

        match(dealerHand[0], playerHand[0]);
        match(dealerHand[0], playerHand[1]);
        // match(dealerHand[0], player2Hand[0]);
        // match(dealerHand[0], player2Hand[1]);
        // match(dealerHand[0], player3Hand[0]);
        // match(dealerHand[0], player3Hand[1]);
        playerHand = [];
        // player2Hand = [];
        // player3Hand = [];
        dealerHand = [];
        Play();
    }


    // let card1 = {
    //     id: 2,
    //     suit: "Hearts",
    //     cardFace: "Two",
    //     cardValue: 2
    // }
    // let card2 = {
    //     id: 12,
    //     suit: "Spades",
    //     cardFace: "Three",
    //     cardValue: 3
    // }
    // let card3 = {
    //     id: 2,
    //     suit: "Hearts",
    //     cardFace: "Two",
    //     cardValue: 2
    // }
    // let card4 = {
    //     id: 2,
    //     suit: "Hearts",
    //     cardFace: "Ten",
    //     cardValue: 10
    // }

    Play();
    return result;
};

for (let index = 0; index < 1000; index++) {
    MongoClient.connect('mongodb://surface:27017', { useUnifiedTopology: true }, (err, client) => {
        // Client returned
        var db = client.db('bj');
        var doc = match_the_dealer();
        // insert document to 'users' collection using insertOne
        db.collection("mtd").insertOne(doc, function(err, res) {
            if (err) throw err;
        });
    });
    // const playOut = match_the_dealer();
    // console.log(playOut);
}

console.log("finished");

module.exports = match_the_dealer;