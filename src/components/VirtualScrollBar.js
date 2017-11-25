import React from 'react';
import PropTypes from 'prop-types';

export default class VirtualScrollBar extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
  };

  render(){
    return (
      <div>hello</div>
    )
  }
}