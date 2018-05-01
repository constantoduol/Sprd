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
    showFooter={true}
    infiniteScroll={true}
    width={800}
    height={600}
    onEvent={(eventType, range, data) => {
      // console.log(eventType, range, data) 
      // if(range) console.log(range.getAddress())
    }}
    // columnDataTypes={['string', 'number']}
    cellOverride={(cellInfo, innerCell, outerCell) => {
      // if(cellInfo.row === 0){
      //   innerCell = (
      //     <select {...innerCell.props} style={{padding: 3}} ref={innerCell.ref}>
      //       <option>Hello</option>
      //       <option>World</option>
      //     </select>
      //   )
      // }
      // if(cellInfo.row === 0){
      //   outerCell = <outerCell {...outerCell.props} style={{fontWeight: 'bold'}}/>
      // }

      // if(cellInfo.row > 5 && cellInfo.row < 10){
      //   outerCell = <outerCell {...outerCell.props} style={{color: 'green'}}/>
      // }
      // if(cellInfo.dataType === "number"){
      //   outerCell = <outerCell {...outerCell.props} style={{color: 'blue', fontSize: 11}} key={outerCell.key}/>
      // }
      return {innerCell, outerCell}}
    }
    data={data}/>, 
  document.getElementById('root')
);
