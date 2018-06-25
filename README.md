## Getting Started

`npm install sprd`

## How it looks

![Alt text](images/sprd.gif?raw=true "Sprd in Action")

or 

[Demo Video](https://www.useloom.com/share/1106217b86584231b2bcdb583384fd5f)

## Loading inital data
import SprdContainer from 'sprd';

```javascript
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
];

<SprdContainer 
  width={800}
  height={600}
  data={data}/>

```

## Listening to events

```javascript
import SprdContainer from 'sprd';

<SprdContainer 
  width={800}
  height={600}
  onEvent={(eventType, range, data) => {
     console.log(eventType, range, data) 
     if(range) console.log(range.getAddress())
  }}
  data={data}/>

```

## Overriding the cells with custom ones

```
javascript
import SprdContainer from 'sprd';

<SprdContainer 
  width={800}
  height={600}
  cellOverride={(cellInfo, innerCell, outerCell) => {
    if(cellInfo.row === 0){
      innerCell = (
        <select {...innerCell.props} style={{padding: 3}} ref={innerCell.ref}>
          <option>Hello</option>
          <option>World</option>
        </select>
      )
    }
    if(cellInfo.row === 0){
      outerCell = <span {...outerCell.props} style={{fontWeight: 'bold'}}/>
    }

    if(cellInfo.row > 5 && cellInfo.row < 10){
      outerCell = <span {...outerCell.props} style={{color: 'green'}}/>
    }

    if(cellInfo.dataType === "number"){
      outerCell = <span {...outerCell.props} style={{color: 'blue', fontSize: 11}} key={outerCell.key}/>
    }
    return {innerCell, outerCell}}
  }
  data={data}/>

```

## Props and meaning

1. `showHeaderLetters` - whether to show the excel like header letters at the top of columns, default is true
2. `showFooter` - whether to show the footer that displays the cell address, default is true
3. `infiniteScroll` - whether to scroll infinitely both vertically and horizontally, default is true
4. `width` - the width in pixels of the grid, default is 1000
5. `height` - the height in pixels of the grid, default is 800
6. `onEvent` - javascript function to listen to events in the spreadsheet
7. `columnDataTypes` - an array containing the list of column data types
8. `cellOverride` - a callback to override default cells with your own custom cells
9. `data` - an array of arrays containing the default data

