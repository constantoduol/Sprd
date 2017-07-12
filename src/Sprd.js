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
    autoGrowLeft: false, //grow the spreadsheet as the user scrolls
    autoGrowRight: false,
    width: 600
  }

  constructor(props){
    super(props);
    this.EMPTY_VALUES = {null: null, undefined: undefined}; //what we consider empty
    let [data, headers] = this.parseData();
    this.state = {
      data: data,
      headers: headers,
      maxRow: 20,
      maxCol: 10
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

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.div);
    return (
      <div style={style}>
        {this.props.showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            maxCol={this.state.maxCol}
            showHeaderLetters={this.props.showHeaderLetters}/>
          <CellContainer data={this.state.data}/>
          <Footer/>
        </table>
      </div>
    )
  }
}

const styles = {
  table: {
    width: "100%",
    maxWidth: "100%",
    borderCollapse: "collapse"
  },
  div: {
    border: "1px solid #BDBDBD",
    margin: 5
  }
}