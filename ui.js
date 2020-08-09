'use strict';
const React = require('react');
const {useInput, render, Text, Color, Box} = require('ink');
const TextInput = require('ink-text-input').default;
const MultiShuffle = require('./shuffle');

const App = () => {
	const [playingDeck, setDeck] = React.useState(MultiShuffle());
	// const [playerHand, setPlayer] = React.useState([]);
	// const [dealerHand, setDealer] = React.useState([]);
	const [, forceUpdate] = React.useReducer(x => x + 1, 0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			playingDeck.pop();
			forceUpdate();
			if(playingDeck.length == 0) {
				clearInterval(timer)
			};
		},100);
	}, []);
	return (
		<Box>
			<Text>Deck Count: {playingDeck.length} </Text>
			{/* <Text>Count: {count}</Text> */}
		</Box>
	);
};

module.exports = App;