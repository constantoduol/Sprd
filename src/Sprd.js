import React from 'react';
import {merge, difference} from 'lodash';
import Mousetrap from 'mousetrap';
import connectToStores from 'alt-utils/lib/connectToStores';

import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import FormulaBar from './components/FormulaBar';
import Actions from './Actions';
import SprdRange from './SprdRange';
import Store from './Store';
import SprdNavigator from './SprdNavigator';
import {DIRECTION} from './Constants';

@connectToStores
export default class Sprd extends React.Component {

  constructor(props){
    super(props);
    this.keyDown = this.keyDown.bind(this);
    this.KEY_DOWN_IGNORE_KEYS = {
      enter: "enter", 
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
  }


  shouldComponentUpdate(nextProps, nextState){
    //there was a change in the focussed cell
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    //there was a change in data
    if(nextProps.data !== this.props.data) return true;
    if(nextProps.dragging !== this.props.dragging) return true; //dragging is going on
    let shouldUpdate = !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
    if(shouldUpdate) return true;
    //there was a change in header widths
    return difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
  }

  keyDown(e){
    let key = e.key.toLowerCase();
    console.log(key)
    if(key !== "enter"){
      Actions.setFocusedCell(this.props.selectedRange[0]);
    }
  }

  setupKeyBindings(){
    Mousetrap.bind("mod+c", () => {
      console.log("copy");
    });

    Mousetrap.bind("mod+v", () => {
      console.log("paste");
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

    Mousetrap.bind("enter", () => {
      Actions.setFocusedCell(this.props.selectedRange[0]);
    });

    document.onkeydown = (e) => {
      let key = e.key.toLowerCase();
      if(!this.KEY_DOWN_IGNORE_KEYS[key]){
        Actions.setFocusedCell(this.props.selectedRange[0]);
      }
    }

  }

  render(){
    let {
      cols, rows, showFormulaBar, headerWidths, 
      selectedRange, showHeaderLetters, 
      data, focusedCell, width, height, minRow, minCol, valueSetRange, dragging} = this.props;
    let style = merge(styles.root, {width});
    return (
      <div style={style} draggable="false">
        {showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            cols={cols}
            headerWidths={headerWidths}
            selectedRange={selectedRange}
            minCol={minCol}
            showHeaderLetters={showHeaderLetters}/>
          <CellContainer 
            cols={cols} 
            minCol={minCol}
            minRow={minRow}
            data={data}
            valueSetRange={valueSetRange}
            selectedRange={selectedRange}
            focusedCell={focusedCell}
            dragging={dragging}
            rows={rows}/>
        </table>
        <Footer width={width}/>
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
    userSelect: "none"
  }
}