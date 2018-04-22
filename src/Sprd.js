import React from 'react';
import {merge, difference} from 'lodash';
import Mousetrap from 'mousetrap';
import connectToStores from 'alt-utils/lib/connectToStores';

import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import Actions from './Actions';
import SprdRange from './SprdRange';
import Store from './Store';
import SprdNavigator from './SprdNavigator';
import {eventTriggered, copyToClipboard} from './Util';
import {DIRECTION, EVENT, UNKNOWN} from './Constants';

@connectToStores
export default class Sprd extends React.Component {

  constructor(props){
    super(props);
    this.keyDown = this.keyDown.bind(this);
    this.KEY_DOWN_IGNORE_KEYS = {
      arrowleft: "arrowleft", 
      arrowdown: "arrowdown", 
      arrowright: "arrowright",
      arrowup: "arrowup",
      alt: "alt",
      control: "control",
      shift: "shift"
    };
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  componentDidMount(){
    this.setupKeyBindings();
    this.container.addEventListener('paste', this.handlePaste.bind(this));
  }


  shouldComponentUpdate(nextProps, nextState){
    //there was a change in the ranges
    let rangesChanged = SprdRange.areEqual(Object.values(nextProps.ranges.toJS()), Object.values(this.props.ranges.toJS()));
    if(!rangesChanged) return true;
    //there was a change in data
    if(nextProps.data !== this.props.data) return true;
    return nextProps.dragging !== this.props.dragging;
  }

  keyDown(e){
    let key = e.key.toLowerCase();
    let {onEvent, ranges} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    if(key !== "enter"){
      Actions.setRange({'focusedCellRange': clickSelectedRange});
      eventTriggered(onEvent, EVENT.CELL_FOCUSED, clickSelectedRange);
    }
  }

  setupKeyBindings(){
    Mousetrap.bind("mod+c", () => {
      this.handleCopy();
    });

    Mousetrap.bind("mod+a", () => {
      let {onEvent} = this.props;
      let clickSelectedRange = new SprdRange(0, 0, UNKNOWN, UNKNOWN);
      Actions.setRange({'clickSelectedRange': clickSelectedRange});
      eventTriggered(onEvent, EVENT.SELECT_ALL, clickSelectedRange);
    });

    Mousetrap.bind("up", () => {
      SprdNavigator.move(this.props, DIRECTION.UP);
    });

    Mousetrap.bind("down", () => {
      SprdNavigator.move(this.props, DIRECTION.DOWN);
    });

    Mousetrap.bind("right", () => {
      SprdNavigator.move(this.props, DIRECTION.RIGHT);
    });

    Mousetrap.bind("left", () => {
      SprdNavigator.move(this.props, DIRECTION.LEFT);
    });

    document.onkeydown = (e) => {
      let key = e.key.toLowerCase();
      let {onEvent, ranges} = this.props;
      let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges); 
      if(!this.KEY_DOWN_IGNORE_KEYS[key] && !e.ctrlKey && !e.altKey && !e.shiftKey){
        Actions.setRange({'focusedCellRange': clickSelectedRange});
        eventTriggered(onEvent, EVENT.CELL_FOCUSED, clickSelectedRange);
      }
    }
  }

  footerContent(){
    let {ranges} = this.props;
    let {clickSelectedRange, dragSelectedRange} = SprdRange.fromImmutable(null, ranges);
    if(clickSelectedRange.startRow !== UNKNOWN) return clickSelectedRange.getAddress();
    return dragSelectedRange.getAddress();
  }

  handleCopy(){
    let text = "";
    let targetRange;
    let {ranges, data, onEvent} = this.props;
    let {clickSelectedRange, dragSelectedRange} = SprdRange.fromImmutable(null, ranges);

    if(clickSelectedRange.startRow !== UNKNOWN) targetRange = clickSelectedRange;
    else targetRange = dragSelectedRange;

    let {startRow, stopRow, startCol, stopCol} = targetRange;

    if(stopRow === UNKNOWN) stopRow = data.size - 1;
    
    for(let row = startRow; row <= stopRow; row++){
      if(stopCol === UNKNOWN) stopCol = data.get(row).size - 1;

      for(let col = startCol; col <= stopCol; col++){
        let value = data.getIn([row, col]);
        if(value !== undefined){
          text += value + "\t"
        }
      }
      text += "\n";
    }

    copyToClipboard(text);
    eventTriggered(onEvent, EVENT.COPY, targetRange, text);
  }

  handlePaste (e) {
    let clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    let lines = pastedData.split(/\r?\n/);
    let {ranges, data, onEvent} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    let {startRow, stopRow, startCol, stopCol} = clickSelectedRange;
    let originalStartCol = startCol;
    let highLightedRange = new SprdRange(startRow, startCol, stopRow, stopCol);
    let maxTokenLength = 0;

    for(let line of lines){
      let tokens = line.split(/\t?\s/);
      maxTokenLength = Math.max(maxTokenLength, tokens.length);
      if(!data.get(startRow)) data = data.set(startRow, Map({}));
      for(let token of tokens){
        if(token) data = data.setIn([startRow, startCol], token);
        startCol++;
      }
      startRow++;
      startCol = originalStartCol;
    }

    highLightedRange.stopRow = startRow;
    highLightedRange.stopCol = startCol + maxTokenLength - 1;
    ranges = ranges.set('dragSelectedRange', highLightedRange);
    Actions.setState({data: data, ranges: ranges});
    eventTriggered(onEvent, EVENT.PASTE, highLightedRange, lines);
  }

  render(){
    let {
      cols, rows, ranges, showHeaderLetters, data, width, 
      minRow, minCol, dragging, infiniteScroll, showFooter, onEvent, columnDataTypes, cellOverride} = this.props;
    let style = merge(styles.root, {width});
    return (
      <div style={style} draggable="false" ref={container => this.container = container}>
        <table style={styles.table}>
          <HeaderContainer
            cols={cols}
            ranges={ranges}
            minCol={minCol}
            onEvent={onEvent}
            showHeaderLetters={showHeaderLetters}/>
          <CellContainer 
            cols={cols} 
            minCol={minCol}
            minRow={minRow}
            onEvent={onEvent}
            data={data}
            columnDataTypes={columnDataTypes}
            infiniteScroll={infiniteScroll}
            ranges={ranges}
            cellOverride={cellOverride}
            dragging={dragging}
            rows={rows}/>
        </table>
        {showFooter ? <Footer width={width} content={this.footerContent()}/> : null}
      </div>
    )
  }
}

const styles = {
  table: {
    borderCollapse: "collapse",
    borderSpacing: 0,
    userSelect: "none"
  },
  root: {
    borderBottom: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    margin: 5,
    userSelect: "none",
    position: "fixed"
  }
}