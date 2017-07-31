import React from 'react';
import PropTypes from 'prop-types';
import {difference} from 'lodash';

import Header from './Header';
import Actions from '../Actions';

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
    //update only if range changes or header widths change
    let shouldUpdate = difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
    return shouldUpdate;
  }

  renderHeaderLetters(){
    let {selectedRange, headerWidths, colNums} = this.props;
    let headers = [
      <Header 
        title="" 
        col={0}
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
    if(!this.props.showHeaderLetters) return null;
    console.log("re-render");
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