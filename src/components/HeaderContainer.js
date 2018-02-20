import React from 'react';
import PropTypes from 'prop-types';
import {difference} from 'lodash';

import Header from './Header';
import SprdRange from '../SprdRange';

export default class HeaderContainer extends React.Component {

  static propTypes = {
    showHeaderLetters: PropTypes.bool,
    cols: PropTypes.number,
    ranges: PropTypes.object,
    headerWidths: PropTypes.array,
    minCol: PropTypes.number
  };

  toExcelColName(num){
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.ranges !== this.props.ranges) return true;
    if(nextProps.minCol !== this.props.minCol) return true;
    //there was a change in header widths
    return difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
  }

  renderHeaderLetters(){
    let {ranges, headerWidths, cols, minCol} = this.props;
    let headers = [
      <Header 
        title="" 
        col={-1}
        width={50}
        ranges={ranges}
        key="num_header"
      />
    ]; //the first header is for the numbers to the left
    for(let x = minCol; x < cols + minCol; x++){
      let colLetter = this.toExcelColName(x + 1);
      headers.push(
        <Header 
          key={x} 
          col={x} 
          width={headerWidths[x % cols]}
          ranges={ranges}
          title={colLetter} 
        />
      );
    }
    return headers;
  }

  render(){ 
    //console.log("header container re-render")
    return (
      <thead style={styles.thead}>
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
  },
  thead: {
    borderTop: "1px solid #BDBDBD",
    borderBottom: "1px solid #BDBDBD"
  }
};