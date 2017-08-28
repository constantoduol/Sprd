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

  constructor(props){
    super(props);
    this.state = {
      cellCache: {},
      rowCache: []
    }
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   if(nextProps.data !== this.props.data) return true;
  //   if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
  //   if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
  //     return true;
  //   if(nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow)
  //     return true;
  //   return !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
  // }

  componentWillReceiveProps(nextProps){
    let {rowCache} = this.state;
    if(nextProps.rows && nextProps.cols && !rowCache.length) 
      this.generateCells(nextProps);
    this.modifyCells(nextProps);
  }

  getCellValue(row, col){
    let {data} = this.props;
    if(data.get(row) && data.getIn([row, col]))
      return data.getIn([row, col]);
    return "";
  }

  //an imperative approach opposed to react's declarative approach
  //to improve performance
  modifyCells(nextProps){
    let {valueSetRange, selectedRange, focusedCell, minRow, minCol, maxRow, maxCol, data} = nextProps;
    let changed = false;
    let cells = [];
    if(data !== this.props.data) {
      this.modifyCellsBasedOnRanges(valueSetRange, nextProps); 
      changed = true;
    }
    if(!focusedCell.isEqual(this.props.focusedCell)){
      this.modifyCellsBasedOnRanges([focusedCell], nextProps);
      changed = true;
    }
    if(!SprdRange.areEqual(selectedRange, this.props.selectedRange)){
      this.modifyCellsBasedOnRanges(selectedRange, nextProps);
      changed = true;
    }
    if(changed) this.setState(this.state);//directly modifying state?
  }

  modifyCellsBasedOnRanges(ranges, nextProps){
    let {rows, cols} = nextProps;
    let {cellCache, rowCache} = this.state; 
    //console.log(ranges, cellCache);
    for(let range of ranges){
      let {startRow, stopRow, startCol, stopCol} = range;
      for(let row = startRow; row <= stopRow; row++){
        let modRow = row % rows;
        for(let col = stopCol; col <= stopCol; col++){
          let modCol = col % cols;
          console.log(row, col);
          cellCache[modRow][0] = this.generateNumberCell(row, nextProps);
          cellCache[modRow][modCol + 1] = this.generateCell(row, col, nextProps);
        }
        rowCache[modRow] = this.generateRow(row, nextProps, cellCache[modRow]);
      }
    }
  }

  generateCell(row, col, nextProps){
    let {
      minRow, minCol, maxRow, maxCol, rows, 
      cols, selectedRange, focusedCell} = nextProps;
    return(
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
        key={row % rows + "_" + col % cols}/>
    )
  }

  generateNumberCell(row, nextProps){
    let {selectedRange, rows} = nextProps;
    return (
      <NumberCell 
        key={"num_" + row % rows} 
        row={row} 
        selectedRange={selectedRange}/>
    );
  }

  generateRow(row, nextProps, currentRow){
    let {data, rows} = nextProps;
    let modRow = row % rows;
    let height = 0;
    if(data.get(modRow))
      height = data.get(modRow).get('height');
    return (
      <TableRow 
        key={"row_"+modRow} 
        rowData={currentRow} 
        height={height}/>
    );
  }

  generateCells(props){
    let {data, selectedRange, rows, cols, focusedCell, minRow, minCol, maxRow, maxCol} = props;
    let {cellCache, rowCache} = this.state;
    let allRows = [];
    for(let row = minRow; row < rows + minRow; row++){
      let currentRow = [];
      let modRow = row % rows; //modular row
      if(!cellCache[modRow]) cellCache[modRow] = [];
      cellCache[modRow].push(
        this.generateNumberCell(row, props)
      );

      for(let col = minCol; col < cols + minCol; col++){
        let modCol = col % cols; //modular column
        cellCache[modRow].push(
          this.generateCell(row, col, props)
        );
      }

      rowCache.push(
        this.generateRow(row, props, cellCache[modRow])
      );
    }
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
        {this.state.rowCache}
      </tbody>
    );
  }
}

