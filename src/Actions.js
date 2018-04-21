import alt from './altConfig';
import {isArray} from 'lodash';
import {Map} from 'immutable';


class Actions {

  setRange(range){
    return range;
  }

  clearSelectedRange(){
    return [];
  }

  setValue(value, ranges){
    return [value, ranges];
  }

  setData(data){
    return data;
  }

  setState(state){
    return state;
  }

  setViewPort(minRow, minCol){ 
    return [minRow, minCol];
  }

  dragStarted(dragOrigin){
    return dragOrigin;
  }

  dragStopped(dragEnd){
    return dragEnd;
  }

  addDragZone(range){
    return range;
  }

  parseData(rawData, rows, cols){
    console.log(rawData)
    let data = Map();
    if(isArray(rawData)){
      for(let row = 0; row < rawData.length; row++){
          if(!data.get(row)) data = data.set(row, Map());
          for(let col = 0; col < rawData[row].length; col++){
            let value = rawData[row][col];
            if(value) data = data.setIn([row, col], value);
          }
      }   
    } else if(rawData) {
      console.warn("Unrecognized object passed into Sprd as data");
      return;
    }
    return [data, rows, cols];
  }

}

export default alt.createActions(Actions);