import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';
import SprdRange from '../SprdRange';

export default class CellContainer extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    data: PropTypes.object,
    selectedRange: PropTypes.array,
    minCol: PropTypes.number,
    minRow: PropTypes.number
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.data !== this.props.data) return true;
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
      return true;
    if(nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow)
      return true;
    return !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
  }


  getCellValue(row, col){
    let {data} = this.props;
    if(data.get(row) && data.getIn([row, col]))
      return data.getIn([row, col]);
    return "";
  }

  renderCells(){
    let {data, selectedRange, rows, cols, focusedCell, minRow, minCol, maxRow, maxCol} = this.props;
    let allRows = [];
    for(let row = minRow; row < rows + minRow; row++){
      let currentRow = [];
      let modRow = row % rows; //modular row
      currentRow.push(
        <NumberCell 
          key={"num_" + row} 
          row={row} 
          selectedRange={selectedRange}/>
      );

      for(let col = minCol; col < cols + minCol; col++){
        let modCol = col % cols; //modular column
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            minRow={minRow}
            minCol={minCol}
            maxRow={maxRow}
            maxCol={maxCol}
            rows={rows}
            cols={cols}
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

