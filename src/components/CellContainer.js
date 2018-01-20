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
    ranges: PropTypes.object,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    dragging: PropTypes.bool
  };

  shouldComponentUpdate(nextProps, nextState){
    //there was a change in the ranges
    if(nextProps.ranges !== this.props.ranges) return true;
    if(nextProps.rows !== this.props.rows || nextProps.cols !== this.props.cols)
      return true;
    return nextProps.minCol !== this.props.minCol || nextProps.minRow !== this.props.minRow;
  }

  componentWillReceiveProps(nextProps){
    let {recentDragCell} = nextProps;
    //this.maybeScrollIfRangeExceededWhileDragging(recentDragCell);
  }


  /**
  * when dragging happens and current screen view port
  * range is exceeded, we scroll
  * @recentCell - this is a sprd range representing the most recent cell
  *               covered while dragging
  */
  maybeScrollIfRangeExceededWhileDragging(recentCell){
    let {minCol, minRow, cols, rows, dragging} = this.props;
    if(!dragging) return;

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
    let {data, rows, cols, minRow, minCol, dragging, ranges} = this.props;
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

