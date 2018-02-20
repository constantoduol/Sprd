import React from 'react';

import Sprd from './Sprd';
import Actions from './Actions';
import {DEFAULT_HEADER_WIDTH, DEFAULT_ROW_HEIGHT} from './Constants'; 

export default class SprdContainer extends React.Component {

  static defaultProps = {
    data: null, //data is in format {header1: [value1, value2], header2: [value3, value4]}
    showHeaderLetters: true, //show the letters at top A, B, C ... AA, AB
    showRowNumbers: true,
    showFormulaBar: true,
    infinite: true, //scroll infinitely in any directions
    showFooter: true,
    width: 800,
    height: 600
  };

  componentDidMount(){
    let {width, height} = this.props;
    let cols = parseInt(width/DEFAULT_HEADER_WIDTH);
    let rows = parseInt(height/DEFAULT_ROW_HEIGHT) - 2; //-2 for header and footer
    Actions.parseData(this.props.data, rows, cols);
  }

  render(){
    return (
      <Sprd {...this.props}/>
    )
  }
}