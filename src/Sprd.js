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

const DIRECTIONS = {UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right"};

@connectToStores
export default class Sprd extends React.Component {

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
    //there was a change in header widths
    let shouldUpdate = !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
    if(shouldUpdate) return true;
    return difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
  }

  setupKeyBindings(){
    Mousetrap.bind(["ctrl+c", "command+c"], () => {
      console.log("copy");
    });
    Mousetrap.bind(["ctrl+v", "command+v"], () => {
      console.log("paste");
    });
    Mousetrap.bind("up", () => {
      Navigator.move(this.props.selectedRange, DIRECTIONS.UP);
    });
    Mousetrap.bind("down", () => {
      Navigator.move(this.props.selectedRange, DIRECTIONS.DOWN);
    });
    Mousetrap.bind("right", () => {
      Navigator.move(this.props.selectedRange, DIRECTIONS.RIGHT);
    });
    Mousetrap.bind("left", () => {
      Navigator.move(this.props.selectedRange, DIRECTIONS.LEFT);
    });    
  }

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.root);
    let {colNums, rowNums, showFormulaBar, headerWidths, selectedRange, showHeaderLetters, data} = this.props;
    return (
      <div style={style}>
        {showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            colNums={colNums}
            headerWidths={headerWidths}
            selectedRange={selectedRange}
            showHeaderLetters={showHeaderLetters}/>
          <CellContainer 
            colNums={colNums} 
            data={data}
            selectedRange={selectedRange}
            rowNums={rowNums}/>
        </table>
        <Footer/>
      </div>
    )
  }
}

//used to handle arrow key movements
class Navigator {

  static move(currentSelectedRange, direction){
    let {startRow, stopRow, startCol, stopCol} = currentSelectedRange[0];
    if(direction === DIRECTIONS.UP){
      if(startRow > 0) startRow--;
      if(stopRow > 0) stopRow--;
    } else if(direction === DIRECTIONS.DOWN){
      startRow++;
      stopRow++;
    } else if(direction === DIRECTIONS.LEFT){
      if(startCol > 0)startCol--;
      if(stopCol > 0) stopCol--;
    } else if(direction === DIRECTIONS.RIGHT){
      startCol++;
      stopCol++;
    }
    Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
  }

}

const styles = {
  table: {
    width: "100%",
    maxWidth: "100%",
    borderCollapse: "collapse",
    borderSpacing: 0
  },
  root: {
    borderTop: "1px solid #BDBDBD",
    borderBottom: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    margin: 5
  }
}