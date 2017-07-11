import React from 'react';
import {isObject, isArray, cloneDeep} from 'lodash';
import {Map} from immutable;
import Footer from 'Footer';
import HeaderContainer from 'HeaderContainer';
import CellContainer from 'CellContainer';

export default class Sprd extends React.Component {

  static defaultProps = {
    data: null, //data is in format {header1: [value1, value2], header2: [value3, value4]}
    config:{
      showHeaderLetters: true, //show the letters at top A, B, C ... AA, AB
      firstRowIsHeaders: false,
      showRowNumbers: true,
      showFormulaBar: true,
      showFooter: true,
      autoGrow: false, //grow the spreadsheet as the user scrolls
      defaultNumRows: 20, //in case no data is specified
      defaultNumCols: 10 //in case no data is specified
      components: { //override components

      }
    }
  }

  constructor(props){
    super(props);
    if(this.props.data){
      this.parseData();
    } else {
      console.warn('No valid data passed to Sprd');
    }
    this.state = {
      data: {},
      maxRow: this.props.defaultNumRows,
      maxCol: this.props.defaultNumCols
    };
    this.EMPTY_VALUES = {null: null, undefined: undefined}; //what we consider empty
  }

  parseData(){
    if(isObject(this.props.data)){
      let data = {};
      let headers = Object.keys(this.props.data); //there is no guarantee for header order
      for(let col = 0, row = 0; col < headers.length; col++){
        let headerData = this.props.data[headers[col]];
        if(!data[row]) data[row] = {};

        if(this.EMPTY_VALUES[headerData[row]] === headerData[row])//we don't store empty values
        else data[row][col] = headerData[row]; 

        if(col == headers.length){
          col = 0;
          row++;
        }
        if(row == headerData.length) break;
      }   
      this.setState({data: data, headers: headers});

    } else if(!this.props.data){
      //build an empty spreadsheet
    } else {
      console.warn("Unrecognized object passed into Sprd as data");
    }
  }

  static getComponent(name){
    let components = this.props.config.components;
    if(components){
      components[name];
    }
  }

  render(){
    return (
      <div>
        <HeaderContainer 
          headers={this.state.headers} 
          firstRowIsHeaders={this.props.firstRowIsHeaders}
          showFormulaBar={this.props.showFormulaBar}
          showHeaderLetters={this.props.showHeaderLetters}/>
        <CellContainer data={this.state.data}/>
        <Footer/>
      </div>
    )
  }
}