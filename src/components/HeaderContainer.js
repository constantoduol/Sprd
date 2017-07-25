import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

//renders the headers
export default class HeaderContainer extends React.Component {

  static propTypes = {
    showHeaderLetters: PropTypes.bool,
    colNums: PropTypes.number,
    headerWidths: PropTypes.array,
    selectedRange: PropTypes.array
  };

  constructor(props){
    super(props);
  }

  toExcelColName(num){
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  }

  renderHeaderLetters(){
    let {selectedRange} = this.props;
    let headers = [
      <Header 
        title="" 
        selectedRange={selectedRange} 
        width={50}
      />
    ]; //the first header is for the numbers to the left
    for(let x = 1; x <= this.props.colNums; x++){
      let colLetter = this.toExcelColName(x);
      headers.push(
        <Header 
          key={x} 
          col={x - 1} 
          title={colLetter} 
          selectedRange={selectedRange} 
          width={this.props.headerWidths[x - 1]}
        />
      );
    }
    return headers;
  }

  render(){ 
    if(!this.props.showHeaderLetters) return;
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