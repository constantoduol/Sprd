import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';

export default class CellContainer extends React.Component {

  static propTypes = {
    rowNums: PropTypes.number,
    colNums: PropTypes.number,
    data: PropTypes.object,
    selectedRange: PropTypes.array
  };

  renderCells(){
    let {data, selectedRange, rowNums, colNums} = this.props;
    let allRows = [];
    for(let row = 0; row < rowNums; row++){
      let currentRow = [];
      currentRow.push(
        <NumberCell key={"num_" + row} row={row} selectedRange={selectedRange}/>
      );
      for(let col = 0; col < colNums; col++){
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            selectedRange={selectedRange}
            key={row + "_" + col}/>
        );
      }
      let rowStyle = {height: data[row]['height']};
      allRows.push(<tr key={"row_" + row} style={rowStyle}>{currentRow}</tr>);
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

