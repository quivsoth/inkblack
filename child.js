// // const React, { memo } = require("react");\
const React = require('react');
const { memo } = require('react');


const Child = ({ reset }) => {
    console.log("Child");
return null;
    // return (
    //     <Text>child component which resets count</Text>
    // );
};

module.exports = Child;