import {DIRECTION} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(props, direction){
    let {ranges, minCol, minRow, rows, cols, infiniteScroll, dontSetClickSelectedRange} = props;
    let {clickSelectedRange, dragSelectedRange, dragOriginCellRange} = SprdRange.fromImmutable(null, ranges);
    let {startRow, stopRow, startCol, stopCol} = clickSelectedRange;

    let previousMinCol = minCol;
    let previousMinRow = minRow;

    switch(direction){
      case DIRECTION.UP:
        if(startRow > 0) startRow--;
        if(stopRow > 0) stopRow--;
        break;
      case DIRECTION.DOWN:
        startRow++;
        stopRow++;
        break;
      case DIRECTION.LEFT:
        if(startCol > 0)startCol--;
        if(stopCol > 0) stopCol--;
        break;
      case DIRECTION.RIGHT:
        startCol++;
        stopCol++;
    }

    if(startRow >= minRow + rows) minRow++;
    else if( (startRow + 1) >= minRow && minRow !== 0) minRow--;

    if(startCol >= minCol + cols) minCol++;
    else if( (startCol + 1) >= minCol && minCol !== 0) minCol--;
    
    if(!infiniteScroll && (minRow > 0 || minCol > 0)) return; //disable infinite scrolling

    if(previousMinRow !== minRow || previousMinCol !== minCol){
      Actions.setViewPort(minRow, minCol);
    }

    if(dontSetClickSelectedRange){
      Actions.setRange({
        dragSelectedRange: dragSelectedRange, 
        dragOriginCellRange: dragOriginCellRange
      });
    } else {
      Actions.setRange({
        clickSelectedRange: new SprdRange(startRow, startCol, stopRow, stopCol), 
        dragSelectedRange: dragSelectedRange, 
        dragOriginCellRange: dragOriginCellRange
      });
    }

  }
}