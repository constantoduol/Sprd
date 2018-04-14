import React from 'react';
import ReactDOM from 'react-dom';
import './sprd.css';
import SprdContainer from './SprdContainer';
let data = {Name: ['sam', 'mike', 'greg'], Age: [20, 30, 40]}
ReactDOM.render(
  <SprdContainer 
    showHeaderLetters={false}
    showFooter={false}
    infiniteScroll={false}
    width={800}
    height={600}
    onEvent={(eventType, range, data) => console.log(eventType, range, data)} 
    data={data}/>, 
  document.getElementById('root')
);
