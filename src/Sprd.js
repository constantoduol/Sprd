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
  }

  //data is reorganized into format {header1: [], header2: [], ...}
  parseData(){
    if(isObject(this.props.data)){
      let data = Map(this.props.data); //avoid modifying the original data
      this.setState({data: data, headers: Object.keys(this.props.data)});
    } else if(this.props.data === null){
      
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
    if(!this.props.data) return;
    let HeaderContainer = 
    return (
      <div>
        <HeaderContainer 
          headers={headers} 
          showFormulaBar={this.props.showFormulaBar}
          showHeaderLetters={this.props.showHeaderLetters}/>
        <CellContainer data={this.state.data}/>
        <Footer/>
      </div>
    )
  }
}