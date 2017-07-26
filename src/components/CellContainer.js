import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';

export default class CellContainer extends React.Component {

  static propTypes = {
    rowNums: PropTypes.number,
    colNums: PropTypes.number
  };

  renderCells(){
    let rowNums = this.props.rowNums;
    let colNums = this.props.colNums;
    let {data, selectedRange} = this.props;
    let allRows = [];
    for(let row = 0; row < rowNums; row++){
      let currentRow = [];
      currentRow.push(
        <NumberCell row={row}/>
      );
      for(let col = 0; col < colNums; col++){
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            key={row + "_" + col}/>
        );
      }
      allRows.push(<TableRow rowData={currentRow} row={row}/>);
    }
    return allRows;
  }

  render(){
    return (
      <tbody>
        {this.renderCells()}
      </tbody>
    );
  }
}

