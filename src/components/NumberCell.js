import React from 'react';
import PropTypes from 'prop-types';

export default class NumberCell extends React.Component {

  static propTypes = {
    num: PropTypes.number
  }

  numberCellClicked(){
    
  }

  render(){
    return (
      <td style={styles.numberCell}>
        {this.props.num}
      </td>
    );
  }
}

const styles = {
  numberCell: {
    border: "1px solid #BDBDBD",
    fontSize: 14,
    fontWeight: 500,
    background: "#EEEEEE",
    textAlign: "center",
    userSelect: "none"
  }
}