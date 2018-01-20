import {DIRECTION} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(props, direction){
    let {ranges: {focusedCellRange}, minCol, minRow, rows, cols} = props;
    let {startRow, stopRow, startCol, stopCol} = focusedCellRange;

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

    if(startRow === minRow + rows) minRow++;
    else if( (startRow + 1) === minRow && minRow !== 0) minRow--;

    if(startCol === minCol + cols) minCol++;
    else if( (startCol + 1) === minCol && minCol !== 0) minCol--;
    
    if(previousMinRow !== minRow || previousMinCol !== minCol){
      Actions.setViewPort(minRow, minCol);
      Actions.setRange({focusedCellRange: new SprdRange(startRow, startCol, stopRow, stopCol)});
    } else {
      Actions.setRange({focusedCellRange: new SprdRange(startRow, startCol, stopRow, stopCol)});
    }
  }
}