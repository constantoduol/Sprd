import React from 'react';
import {isObject} from 'lodash';
import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';

export default class Sprd extends React.Component {

  static defaultProps = {
    data: null, //data is in format {header1: [value1, value2], header2: [value3, value4]}
    showHeaderLetters: true, //show the letters at top A, B, C ... AA, AB
    firstRowIsHeaders: true,
    showRowNumbers: true,
    showFormulaBar: true,
    showFooter: true,
    autoGrow: false, //grow the spreadsheet as the user scrolls
    defaultNumRows: 20, //in case no data is specified
    defaultNumCols: 10, //in case no data is specified
    components: { //override components

    }
    
  }

  constructor(props){
    super(props);
    this.EMPTY_VALUES = {null: null, undefined: undefined}; //what we consider empty
    let [data, headers] = this.parseData();
    this.state = {
      data: data,
      headers: headers,
      maxRow: this.props.defaultNumRows,
      maxCol: this.props.defaultNumCols
    };
  }

  parseData(){
    let data = {};
    let headers = [];
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
    return [data, headers];
  }

  getHeaderContainer(){
    return this.props.components['HeaderContainer'] || HeaderContainer;
  }

  getCellContainer(){
    return this.props.components['CellContainer'] || CellContainer;
  }

  getFooter(){
    return this.props.components['Footer'] || Footer;
  }

  render(){
    let HeaderContainer = this.getHeaderContainer();
    let CellContainer = this.getCellContainer();
    let Footer = this.getFooter();
    return (
      <table style={styles.table}>
        <HeaderContainer 
          maxCol={this.props.maxCol}
          showFormulaBar={this.props.showFormulaBar}
          showHeaderLetters={this.props.showHeaderLetters}/>
        <CellContainer data={this.state.data}/>
        <Footer/>
      </table>
    )
  }
}

const styles = {
  table: {
    width: "100%",
    maxWidth: "100%",
    borderCollapse: "collapse"
  }
}