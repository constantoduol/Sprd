import {DIRECTION, EVENT} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
import {eventTriggered} from './Util';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(props, direction, step = 1){
    let {ranges, minCol, minRow, rows, cols, infiniteScroll, dontSetClickSelectedRange, onEvent, dragging} = props;
    let {clickSelectedRange, dragSelectedRange, dragOriginCellRange} = SprdRange.fromImmutable(null, ranges);
    let {startRow, stopRow, startCol, stopCol} = clickSelectedRange;
    
    let previousMinCol = minCol;
    let previousMinRow = minRow;

    switch(direction){
      case DIRECTION.UP:
        if(startRow > 0) startRow -= step;
        if(stopRow > 0) stopRow -= step;
        break;
      case DIRECTION.DOWN:
        startRow += step;
        stopRow += step;
        break;
      case DIRECTION.LEFT:
        if(startCol > 0)startCol -= step;
        if(stopCol > 0) stopCol -= step;
        break;
      case DIRECTION.RIGHT:
        startCol += step;
        stopCol += step;
    }


    if(startRow >= minRow + rows) minRow += step;
    else if( (startRow + 1) >= minRow && minRow !== 0) minRow -= step;

    if(startCol >= minCol + cols) minCol += step;
    else if( (startCol + 1) >= minCol && minCol !== 0) minCol -= step;
    
    if(!infiniteScroll && (minRow > 0 || minCol > 0)) return; //disable infinite scrolling

    if(previousMinRow !== minRow || previousMinCol !== minCol){
      Actions.setViewPort(minRow, minCol);
    }

    let newClickSelectedRange = new SprdRange(startRow, startCol, stopRow, stopCol);
    if(dontSetClickSelectedRange){
      Actions.setRange({
        dragSelectedRange: dragSelectedRange, 
        dragOriginCellRange: dragOriginCellRange
      });
    } else {
      Actions.setRange({
        clickSelectedRange: newClickSelectedRange, 
        dragSelectedRange: dragSelectedRange, 
        dragOriginCellRange: dragOriginCellRange
      });
    }
    eventTriggered(
      onEvent, EVENT.MOVE, null, {oldPosition: clickSelectedRange, newPosition: newClickSelectedRange});
  }
}