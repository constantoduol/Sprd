import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

//renders the headers
export default class HeaderContainer extends React.Component {

  static propTypes = {
    showHeaderLetters: PropTypes.bool,
    maxCol: PropTypes.number,
    headerWidths: PropTypes.array
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
    console.log(this.props.headerWidths)
    let headers = [];
    for(let x = 1; x <= this.props.maxCol; x++){
      let colLetter = this.toExcelColName(x);
      headers.push(
        <Header key={x} title={colLetter} width={this.props.headerWidths[x - 1]}/>
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
    background: "#E0E0E0"
  }
};