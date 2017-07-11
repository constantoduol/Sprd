import React from 'react';
import ReactDOM from 'react-dom';
import './sprd.css';
import Sprd from './Sprd';

ReactDOM.render(
  <Sprd 
    data={{Name: ['sam', 'mike', 'greg'], Age: [20, 30, 40]}}
  />, 
  document.getElementById('root')
);
