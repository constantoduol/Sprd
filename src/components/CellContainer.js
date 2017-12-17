import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import Actions from '../Actions';
import SprdRange from '../SprdRange';
import SprdNavigator from '../SprdNavigator';
import {DIRECTION} from '../Constants';

export default class CellContainer extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    data: PropTypes.object,
    selectedRange: PropTypes.array,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    dragging: PropTypes.bool,
    dragOrigin: PropTypes.object,
    recentDragCell: PropTypes.object
  };

  shouldComponentUpdate(nextProps, nextState){
    if(nextProps.data !== this.props.data) return true;
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    if(nextProps.dragging !== this.props.dragging) return true; //dragging is going on
    if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
      return true;
    if(nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow)
      return true;
    return !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
  }

  componentWillReceiveProps(nextProps){
    let {recentDragCell} = nextProps;
    this.maybeScrollIfRangeExceeded(recentDragCell);
  }


  /**
  * when dragging happens and current screen view port
  * range is exceeded, we scroll
  * @recentCell - this is a sprd range representing the most recent cell
  *               covered by dragging
  */
  maybeScrollIfRangeExceeded(recentCell){
    let {minCol, minRow, cols, rows} = this.props;
    let maxCol = minCol + cols;
    let maxRow = minRow + rows
    let {startCol, startRow, stopCol, stopRow} = recentCell;
    const THRESHOLD = 3; 
    if(startCol >  maxCol - THRESHOLD){
      SprdNavigator.move({selectedRange: [recentCell], minCol, minRow, rows, cols}, DIRECTION.RIGHT);
    } else if(startRow > maxRow - THRESHOLD){
      SprdNavigator.move({selectedRange: [recentCell], minCol, minRow, rows, cols}, DIRECTION.DOWN);
    } else if(startCol < minCol + THRESHOLD){
      SprdNavigator.move({selectedRange: [recentCell], minCol, minRow, rows, cols}, DIRECTION.LEFT);
    } else if(startRow > minRow + THRESHOLD){
      SprdNavigator.move({selectedRange: [recentCell], minCol, minRow, rows, cols}, DIRECTION.UP);
    }
  }

  getCellValue(row, col){
    let {data} = this.props;
    if(data.get(row) && data.getIn([row, col]))
      return data.getIn([row, col]);
    return "";
  }

  renderCells(){
    let {data, selectedRange, rows, cols, focusedCell, minRow, minCol, dragging, dragOrigin} = this.props;
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
            rows={rows}
            cols={cols}
            value={this.getCellValue(row, col)}
            selectedRange={selectedRange}
            focusedCell={focusedCell}
            dragging={dragging}
            dragOrigin={dragOrigin}
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
    console.log("cell container re-render");
    return (
      <tbody>
        {this.renderCells()}
      </tbody>
    );
  }
}

