import alt from './altConfig';
import {DEFAULT_HEADER_WIDTH, DEFAULT_ROW_HEIGHT} from './Constants'; 
import {isObject} from 'lodash';


class Actions {

  selectRange(range){
    return range;
  }

  clearSelectedRange(){
    return [];
  }

  setValue(value, range){
    return [value, range];
  }

  setData(data){
    return data;
  }

  setHeaderWidths(headerWidths){
    return headerWidths;
  }


  parseData(rawData, rowNums, colNums){
    let data = {};
    let headers = [];
    let headerWidths = [50];
    if(isObject(rawData)){
      headers = Object.keys(rawData); //there is no guarantee for header order
      for(let col = 0, row = 0; col < headers.length; col++){
        let headerData = rawData[headers[col]];
        if(!data[row]) data[row] = {};

        if(this.EMPTY_VALUES[headerData[row]] !== headerData[row])//we don't store empty values
          data[row][col] = headerData[row]; 
        if(col === headers.length){
          col = 0;
          row++;
        }
        if(row === headerData.length) break;
      }   
    } else if(rawData) {

      console.warn("Unrecognized object passed into Sprd as data");
    }
    for(let col = 0; col < colNums; col++) headerWidths.push(DEFAULT_HEADER_WIDTH);
    for(let row = 0; row < rowNums; row++){
      if(!data[row]) data[row] = {};
      data[row]['height'] = DEFAULT_ROW_HEIGHT;
    }

    return [data, headers, headerWidths];
  }

}

export default alt.createActions(Actions);