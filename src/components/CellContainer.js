import React from 'react';
import Cell from './Cell';
import PropTypes from 'prop-types';

export default class CellContainer extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    maxRow: PropTypes.number,
    maxCol: PropTypes.number
  };

  render(){
    return (
      <tbody>
        
      </tbody>
    );
  }
}
