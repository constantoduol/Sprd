import React from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import Store from '../Store';

@connectToStores
export default class NumberCell extends React.Component {

  static propTypes = {
    rowData: PropTypes.array,
    row: PropTypes.number
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  render(){
    let {row, rowData, data} = this.props;
    if(!data[row]) return null;
    let style = {height: data[row]['height']};
    return (
      <tr style={style}>{rowData}</tr>
    );
  }
}
