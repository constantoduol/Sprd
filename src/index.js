import React from 'react';
import ReactDOM from 'react-dom';
import './sprd.css';
import SprdContainer from './SprdContainer';
let data = [
    ['Name', 'Age'], 
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],
    ['sam', 20], 
    ['Mike', 30], 
    ['Greg', 40], 
    ['Monroe', 50],

]
ReactDOM.render(
  <SprdContainer 
    showHeaderLetters={true}
    showFooter={false}
    infiniteScroll={true}
    width={800}
    height={600}
    // onEvent={(eventType, range, data) => console.log(eventType, range, data)} 
    // columnDataTypes={['number', 'string']}
    data={data}/>, 
  document.getElementById('root')
);
