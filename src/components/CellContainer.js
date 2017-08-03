import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';
import SprdRange from '../SprdRange';

export default class CellContainer extends React.Component {

  static propTypes = {
    rowNums: PropTypes.number,
    colNums: PropTypes.number,
    data: PropTypes.object,
    selectedRange: PropTypes.array
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.data !== this.props.data) return true;
    if(nextProps.rowNums !== this.props.rowNums || nextProps.colNums !== this.props.colNums)
      return true;
    return !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
  }

  getCellValue(row, col){
    let {data} = this.props;
    if(data[row] && data[row][col])
      return data[row][col];
    return "";
  }

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
            value={this.getCellValue(row, col)}
            selectedRange={selectedRange}
            key={row + "_" + col}/>
        );
      }
      let rowStyle = {height: data.get(row).get('height')};
      allRows.push(<tr key={"row_" + row} style={rowStyle}>{currentRow}</tr>);
    }
    return allRows;
  }

  render(){
    console.log("cell container re-render");
    return (
      <tbody>
        {this.renderCells()}
      </tbody>
    );
  }
}

