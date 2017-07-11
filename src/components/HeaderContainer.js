import React from 'react';
import PropTypes from 'prop-types';

import FormulaBar from './FormulaBar';
import Header from './Header';


//renders the headers
//renders the formula bar
export default class HeaderContainer extends React.Component {

  static propTypes = {
    showFormulaBar: PropTypes.bool,
    showHeaderLetters: PropTypes.bool,
    maxCol: PropTypes.number
  };

  constructor(props){
    super(props);
    this.state = {
      width: 100
    }
  }

  toExcelColName(num){
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
  }

  renderHeaderLetters(){
    let headers = [];
    for(let x = 1; x <= this.props.maxCol; x++){
      let colLetter = this.toExcelColName(x);
      headers.push(
        <Header key={x} title={colLetter} width={this.state.width}/>
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
  th: {
    width: 100,
    fontSize: 14,
    fontWeight: 500
  },
  tr: {
    background: "#E0E0E0"
  }
};