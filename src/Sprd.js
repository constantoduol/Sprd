import React from 'react';
import {isObject, merge} from 'lodash';
import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import FormulaBar from './components/FormulaBar';

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
    this.DEFAULT_HEADER_WIDTH = 80; //pixels
    this.DEFAULT_ROW_HEIGHT = 25; //pixels
    let maxCol = parseInt(this.props.width/this.DEFAULT_HEADER_WIDTH);
    let maxRow = parseInt(this.props.height/this.DEFAULT_ROW_HEIGHT); 
    let [data, headers, headerWidths] = this.parseData(maxRow, maxCol);
    this.state = {
      data: data,
      headers: headers,
      headerWidths: headerWidths,
      maxRow: maxRow,
      maxCol: maxCol
    };
  }

  parseData(maxRow, maxCol){
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
    for(let col = 0; col < maxCol; col++) headerWidths.push(this.DEFAULT_HEADER_WIDTH);
    for(let row = 0; row < maxRow; row++){
      if(!data[row]) data[row] = {};
      data[row]['height'] = this.DEFAULT_ROW_HEIGHT;
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
            maxCol={this.state.maxCol}
            headerWidths={this.state.headerWidths}
            showHeaderLetters={this.props.showHeaderLetters}/>
          <CellContainer 
            headerWidths={this.state.headerWidths}
            data={this.state.data} 
            maxCol={this.state.maxCol} 
            maxRow={this.state.maxRow}/>
        </table>
        <Footer/>
      </div>
    )
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
    margin: 5
  }
}