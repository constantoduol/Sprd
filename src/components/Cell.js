import React from 'react';
import PropTypes from 'prop-types';

export default class Cell extends React.Component {
  
  render(){
    return (
      <td style={styles.td}></td>
    )
  }
}

const styles = {
  td: {
    border: "1px solid #BDBDBD",
    height: 15
  }
}