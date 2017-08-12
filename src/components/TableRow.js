import React from 'react';
import PropTypes from 'prop-types';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import Store from '../Store';

export default class TableRow extends React.Component {

  static propTypes = {
    rowData: PropTypes.array,
    height: PropTypes.number
  }

  render(){
    let {rowData, height} = this.props;
    let style = {height: height};
    return (
      <tr style={style}>{rowData}</tr>
    );
  }
}
