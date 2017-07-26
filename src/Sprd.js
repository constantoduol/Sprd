import React from 'react';
import {merge} from 'lodash';
import Mousetrap from 'mousetrap';
import connectToStores from 'alt-utils/lib/connectToStores';

import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import FormulaBar from './components/FormulaBar';
import {DEFAULT_HEADER_WIDTH, DEFAULT_ROW_HEIGHT} from './Constants'; 
import Actions from './Actions';
import SprdRange from './SprdRange';
import Store from './Store';

const DIRECTIONS = {UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right"};

@connectToStores
export default class Sprd extends React.Component {

  static defaultProps = {
    data: null, //data is in format {header1: [value1, value2], header2: [value3, value4]}
    showHeaderLetters: true, //show the letters at top A, B, C ... AA, AB
    showRowNumbers: true,
    showFormulaBar: true,
    infinite: true, //scroll infinitely in any directions
    showFooter: true,
    width: 800,
    height: 600
  }

  constructor(props){
    super(props);
    let colNums = parseInt(this.props.width/DEFAULT_HEADER_WIDTH);
    let rowNums = parseInt(this.props.height/DEFAULT_ROW_HEIGHT) - 2; //-2 for header and footer 
    this.state = {
      rowNums: rowNums,
      colNums: colNums,
    };
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  componentDidMount(){
    let {rowNums, colNums} = this.state;
    Actions.parseData(this.props.data, rowNums, colNums);
    this.setupKeyBindings();
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
    return (
      <div style={style}>
        {this.props.showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            colNums={this.state.colNums}
            showHeaderLetters={this.props.showHeaderLetters}/>
          <CellContainer 
            colNums={this.state.colNums} 
            rowNums={this.state.rowNums}/>
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