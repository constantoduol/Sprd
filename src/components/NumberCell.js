import React from 'react';
import PropTypes from 'prop-types';

export default class NumberCell extends React.Component {

  static propTypes = {
    num: PropTypes.number
  }

  render(){
    return <td style={styles.td}>{this.props.num}</td>
  }
}

const styles = {
  td: {
    border: "1px solid #BDBDBD",
    fontSize: 14,
    fontWeight: 500,
    background: "#EEEEEE",
    textAlign: "center"
  }
}