import React from 'react';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';
import SprdRange from '../SprdRange';
import {DEFAULT_ROW_HEIGHT} from '../Constants';

export default class CellContainer extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    data: PropTypes.object,
    selectedRange: PropTypes.array
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.data !== this.props.data) return true;
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
      return true;
    return !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
  }

  getCellValue(row, col){
    let {data} = this.props;
    if(data[row] && data[row][col])
      return data[row][col];
    return "";
  }

  getOrSetHeight(row, data){
    let rowData = data.get(row);
    if(!rowData){
      data = data.set(row, Map());
      rowData = data.get(row);
    }
    if(rowData && !rowData.get('height')) {
      rowData.set('height', DEFAULT_ROW_HEIGHT);
      data.set(row, rowData);
    }
    return rowData.get('height');
  }

  renderCells(){
    let {data, selectedRange, rows, cols, focusedCell} = this.props;
    let allRows = [];
    for(let row = 0; row < rows; row++){
      let currentRow = [];
      currentRow.push(
        <NumberCell 
          key={"num_" + row} 
          row={row} 
          selectedRange={selectedRange}/>
      );

      for(let col = 0; col < cols; col++){
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            rows={rows}
            cols={cols}
            value={this.getCellValue(row, col)}
            selectedRange={selectedRange}
            focusedCell={focusedCell}
            key={row + "_" + col}/>
        );
      }
      let height = this.getOrSetHeight(row, data);
      console.log(height)
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

