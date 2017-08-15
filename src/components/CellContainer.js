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
    selectedRange: PropTypes.array,
    minCol: PropTypes.number,
    minRow: PropTypes.number
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.data !== this.props.data) return true;
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    if(nextProps.rowNums !== this.props.rowNums || nextProps.colNums !== this.props.colNums)
      return true;
    if(nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow)
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
    let {data, selectedRange, rowNums, colNums, focusedCell, minRow, minCol} = this.props;
    let allRows = [];
    for(let row = minRow; row < rowNums + minRow; row++){
      let currentRow = [];
      let modRow = row % rowNums; //modular row
      currentRow.push(
        <NumberCell 
          key={"num_" + row} 
          row={row} 
          selectedRange={selectedRange}/>
      );

      for(let col = minCol; col < colNums + minCol; col++){
        console.log("happened")
        let modCol = col % colNums; //modular column
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            minRow={minRow}
            minCol={minCol}
            rowNums={rowNums}
            colNums={colNums}
            value={this.getCellValue(row, col)}
            selectedRange={selectedRange}
            focusedCell={focusedCell}
            key={row + "_" + col}/>
        );
      }
      let height = data.get(modRow).get('height');
      allRows.push(
        <TableRow 
          key={"row_"+row} 
          rowData={currentRow} 
          height={height}/>
      );
    }
    return allRows;
  }

  render(){
    //console.log("cell container re-render");
    return (
      <tbody>
        {this.renderCells()}
      </tbody>
    );
  }
}

