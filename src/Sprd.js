import React from 'react';
import {isObject, merge} from 'lodash';
import connectToStores from 'alt-utils/lib/connectToStores';
import Mousetrap from 'mousetrap';
import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import FormulaBar from './components/FormulaBar';
import {DEFAULT_HEADER_WIDTH, DEFAULT_ROW_HEIGHT} from './Constants'; 
import Store from './Store';
import Actions from './Actions';
import SprdRange from './SprdRange';

const DIRECTIONS = {UP: "up", DOWN: "down", LEFT: "left", RIGHT: "right"};

@connectToStores
export default class Sprd extends React.Component {

  static defaultProps = {
    data: null, //data is in format {header1: [value1, value2], header2: [value3, value4]}
    showHeaderLetters: true, //show the letters at top A, B, C ... AA, AB
    firstRowIsHeaders: true,
    showRowNumbers: true,
    showFormulaBar: true,
    infinite: true, //scroll infinitely in any directions
    showFooter: true,
    width: 800,
    height: 600
  }

  constructor(props){
    super(props);
    this.EMPTY_VALUES = {null: null, undefined: undefined}; //what we consider empty
    let colNums = parseInt(this.props.width/DEFAULT_HEADER_WIDTH);
    let rowNums = parseInt(this.props.height/DEFAULT_ROW_HEIGHT) - 2; //-2 for header and footer 
    let [data, headers, headerWidths] = this.parseData(rowNums, colNums);
    this.state = {
      data: data,
      headers: headers,
      headerWidths: headerWidths,
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

  componentDidMount(){
    this.setupKeyBindings();
  }

  parseData(rowNums, colNums){
    let data = {};
    let headers = [];
    let headerWidths = [];
    if(isObject(this.props.data)){
      headers = Object.keys(this.props.data); //there is no guarantee for header order
      for(let col = 0, row = 0; col < headers.length; col++){
        let headerData = this.props.data[headers[col]];
        if(!data[row]) data[row] = {};

        if(this.EMPTY_VALUES[headerData[row]] !== headerData[row])//we don't store empty values
          data[row][col] = headerData[row]; 
        if(col === headers.length){
          col = 0;
          row++;
        }
        if(row === headerData.length) break;
      }   
    } else if(this.props.data) {

      console.warn("Unrecognized object passed into Sprd as data");
    }
    for(let col = 0; col < colNums; col++) headerWidths.push(DEFAULT_HEADER_WIDTH);
    for(let row = 0; row < rowNums; row++){
      if(!data[row]) data[row] = {};
      data[row]['height'] = DEFAULT_ROW_HEIGHT;
    }

    return [data, headers, headerWidths];
  }

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.root);
    return (
      <div style={style}>
        {this.props.showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            selectedRange={this.props.selectedRange}
            colNums={this.state.colNums}
            headerWidths={this.state.headerWidths}
            showHeaderLetters={this.props.showHeaderLetters}/>
          <CellContainer 
            headerWidths={this.state.headerWidths}
            selectedRange={this.props.selectedRange}
            data={this.state.data} 
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