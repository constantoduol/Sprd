import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import NumberCell from './NumberCell';
import TableRow from './TableRow';
import SprdRange from '../SprdRange';
import SprdNavigator from '../SprdNavigator';
import {DIRECTION} from '../Constants';

export default class CellContainer extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    data: PropTypes.object,
    ranges: PropTypes.object,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    dragging: PropTypes.bool,
    infiniteScroll: PropTypes.bool
  };

  shouldComponentUpdate(nextProps, nextState){
    //there was a change in the ranges
    let rangesEqual = SprdRange.areEqual(Object.values(nextProps.ranges.toJS()), Object.values(this.props.ranges.toJS()));
    if(!rangesEqual) return true;
    if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
      return true;
    if(nextProps.dragging !== this.props.dragging) return true;
    return nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow;
  }

  componentWillReceiveProps(nextProps){
    this.maybeScrollIfRangeExceededWhileDragging(nextProps);
  }

  /**
  * get the general direction of movement from 2 sprd ranges representing the previous drag selected
  * range and the current drag selected range
  */
  directionOfMotion(oldDragSelectedRange, newDragSelectedRange){
    if(!oldDragSelectedRange || !newDragSelectedRange) return;
    let {startCol, startRow, stopRow, stopCol} = newDragSelectedRange;
    let {startCol: oldStartCol, startRow: oldStartRow, stopRow: oldStopRow, stopCol: oldStopCol} = oldDragSelectedRange;
    if(startCol !== oldStartCol) return DIRECTION.LEFT;
    else if(startRow !== oldStartRow) return DIRECTION.UP;
    else if(stopRow !== oldStopRow) return DIRECTION.DOWN;
    else if(stopCol !== oldStopCol) return DIRECTION.RIGHT; 
  }


  /**
  * when dragging happens and current screen view port
  * range is exceeded, we scroll
  */
  maybeScrollIfRangeExceededWhileDragging(nextProps){
    let {minCol, minRow, cols, rows, dragging, ranges, infiniteScroll} = nextProps;
    let recentDragCellRange = SprdRange.fromImmutable('recentDragCellRange', nextProps.ranges);
    let {startRow, stopRow, startCol, stopCol} = recentDragCellRange;
    if(!dragging || startCol < 0 || startRow < 0) return;

    let maxCol = minCol + cols;
    let maxRow = minRow + rows
    
    let newDragSelectedRange = SprdRange.fromImmutable('dragSelectedRange', nextProps.ranges);
    let oldDragSelectedRange = SprdRange.fromImmutable('dragSelectedRange', this.props.ranges);
    let direction = this.directionOfMotion(oldDragSelectedRange, newDragSelectedRange);

    const THRESHOLD = direction === DIRECTION.RIGHT || DIRECTION.DOWN ? 2 : -2;
    recentDragCellRange = new SprdRange(startRow + THRESHOLD, startCol + THRESHOLD, stopRow + THRESHOLD, stopCol + THRESHOLD);
    ranges = ranges.set('clickSelectedRange', recentDragCellRange);
    let dontSetClickSelectedRange = true;
    
    SprdNavigator.move({ranges, minCol, minRow, rows, cols, infiniteScroll, dontSetClickSelectedRange}, direction);
  }

  getCellValue(row, col){
    let {data} = this.props;
    if(data.get(row) && data.getIn([row, col]))
      return data.getIn([row, col]);
    return "";
  }

  renderCells(){
    let {data, rows, cols, minRow, minCol, dragging, ranges, infiniteScroll} = this.props;
    let allRows = [];
    for(let row = minRow; row < rows + minRow; row++){
      let currentRow = [];
      let modRow = row % rows; //modular row
      currentRow.push(
        <NumberCell 
          key={"num_" + row} 
          row={row} 
          ranges={ranges}/>
      );

      for(let col = minCol; col < cols + minCol; col++){
        currentRow.push(
          <Cell 
            row={row} 
            col={col} 
            minRow={minRow}
            minCol={minCol}
            rows={rows}
            cols={cols}
            value={this.getCellValue(row, col)}
            infiniteScroll={infiniteScroll}
            ranges={ranges}
            dragging={dragging}
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

