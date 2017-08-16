import {DIRECTION} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(props, direction){
    let {selectedRange, rows, cols} = props;
    let {startRow, stopRow, startCol, stopCol} = selectedRange[0]; //we assume its only one range selected

    let previousRows = rows;
    let previousCols = cols;

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

    if(startRow === rows) rows++;
    // else if( (startRow + 1) === minRow && minRow !== 0) minRow--;

    if(startCol === cols) cols++;
    // else if( (startCol + 1) === minCol && minCol !== 0) minCol--;

    
    if(previousRows !== rows || previousCols !== cols){
      Actions.setViewPort(rows, cols);
      Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
    } else {
      Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
    }
  }
}