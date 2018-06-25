import React from 'react';
import PropTypes from 'prop-types';

import {DEFAULT_ROW_HEIGHT} from '../Constants'

export default class TableRow extends React.Component {

  static propTypes = {
    rowData: PropTypes.array
  }

  render(){
    let {rowData} = this.props;
    let style = {height: DEFAULT_ROW_HEIGHT};
    return (
      <tr style={style}>{rowData}</tr>
    );
  }
}
