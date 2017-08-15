import alt from './altConfig';
import {DEFAULT_HEADER_WIDTH, DEFAULT_ROW_HEIGHT} from './Constants'; 
import {isObject} from 'lodash';
import {Map} from 'immutable';


class Actions {

  selectRange(range){
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

  setHeaderWidths(headerWidths){
    return headerWidths;
  }

  setViewPort(minRow, minCol){ 
    return [minRow, minCol];
  }

  setFocusedCell(range){
    return range;
  }


  parseData(rawData, rows, cols){
    let data = Map();
    let headers = [];
    let headerWidths = [];
    if(isObject(rawData)){
      console.log("here data");
      headers = Object.keys(rawData); //there is no guarantee for header order
      for(let col = 0, row = 0; col < headers.length; col++){
        let headerData = rawData[headers[col]];
        if(!data.get(row)) data = data.set(row, Map());

        if(headerData[row])//we don't store empty values
          data.get(row).set(col, headerData[row]);
        if(col === headers.length){
          col = 0;
          row++;
        }
        if(row === headerData.length) break;
      }   
    } else if(rawData) {
      console.warn("Unrecognized object passed into Sprd as data");
    }
    for(let col = 0; col < cols; col++) headerWidths.push(DEFAULT_HEADER_WIDTH);
    for(let row = 0; row < rows; row++){
      if(!data.get(row)) data = data.set(row, Map());
      let rowData = data.get(row);
      rowData = rowData.set('height', DEFAULT_ROW_HEIGHT);
      data = data.set(row, rowData);
    }
    return [data, headers, headerWidths, rows, cols];
  }

}

export default alt.createActions(Actions);