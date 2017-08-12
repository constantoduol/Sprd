import {DIRECTION} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(props, direction){
    let {selectedRange, minCol, minRow, rowNums, colNums} = props;
    let {startRow, stopRow, startCol, stopCol} = selectedRange[0]; //we assume its only once range selected

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

    if(startRow === minRow + rowNums) minRow++;
    else if(startRow === minRow && minRow !== 0) minRow--;

    if(startCol === minCol + colNums) minCol++;
    else if(startCol === minCol && minCol !== 0) minCol--;


    if(previousMinRow !== minRow || previousMinCol !== minCol){
      Actions.setViewPort(rowNums, colNums, minRow, minCol);
      Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
    } else {
      Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
    }
  }
}