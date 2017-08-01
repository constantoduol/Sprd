import React from 'react';
import PropTypes from 'prop-types';
import {difference} from 'lodash';

import Header from './Header';
import Actions from '../Actions';
import SprdRange from '../SprdRange';

export default class HeaderContainer extends React.Component {

  static propTypes = {
    showHeaderLetters: PropTypes.bool,
    colNums: PropTypes.number,
    selectedRange: PropTypes.array,
    headerWidths: PropTypes.array
  };

  toExcelColName(num){
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log(nextProps.headerWidths, this.props.headerWidths);
    //update only if range changes or header widths change
    if(this.areAnyHeadersSelected(nextProps)) return true;//there was a change in the selected range
    //there was a change in header widths
    return difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
  }

  areAnyHeadersSelected(nextProps){
    for(let range of nextProps.selectedRange){
      if(range.startCol === range.stopCol && range.startRow === range.stopRow && range.stopRow === -1)
        return true;
    }
    return false;
  }

  renderHeaderLetters(){
    let {selectedRange, headerWidths, colNums} = this.props;
    let headers = [
      <Header 
        title="" 
        col={-1}
        width={50}
        selectedRange={selectedRange}
        key="num_header"
      />
    ]; //the first header is for the numbers to the left
    for(let x = 0; x < colNums; x++){
      let colLetter = this.toExcelColName(x + 1);
      headers.push(
        <Header 
          key={x} 
          col={x} 
          width={headerWidths[x]}
          selectedRange={selectedRange}
          title={colLetter} 
        />
      );
    }
    return headers;
  }

  render(){ 
    console.log("re-render")
    return (
      <thead>
        <tr style={styles.tr}>
          {this.renderHeaderLetters()}
        </tr>
      </thead>
    );
  }
}

const styles = {
  tr: {
    background: "#E0E0E0",
    height: 20
  }
};