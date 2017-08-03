import {DIRECTION} from './Constants';
import SprdRange from './SprdRange';
import Actions from './Actions';
//used to handle arrow key movements

export default class SprdNavigator {

  static move(currentSelectedRange, direction){
    let {startRow, stopRow, startCol, stopCol} = currentSelectedRange[0];
    if(direction === DIRECTION.UP){
      if(startRow > 0) startRow--;
      if(stopRow > 0) stopRow--;
    } else if(direction === DIRECTION.DOWN){
      startRow++;
      stopRow++;
    } else if(direction === DIRECTION.LEFT){
      if(startCol > 0)startCol--;
      if(stopCol > 0) stopCol--;
    } else if(direction === DIRECTION.RIGHT){
      startCol++;
      stopCol++;
    }
    Actions.selectRange(new SprdRange(startRow, startCol, stopRow, stopCol));
  }
}