import React from 'react';
import PropTypes from 'prop-types';

export default class NumberCell extends React.Component {

  static propTypes = {
    num: PropTypes.number
  }

  render(){
    return (
      <td style={styles.numberCell}>
        {this.props.num}
        <div className="resize" style={styles.resize}></div>
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
    textAlign: "center"
  },
  resize: {
    height: 5,
    float: "right",
    cursor: "row-resize",
    width: 50
  }
}