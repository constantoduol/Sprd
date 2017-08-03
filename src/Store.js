import Actions from './Actions';
import alt from './altConfig';
import {isArray} from 'lodash';
import {Map} from 'immutable';

class Store {

  constructor() {
    this.bindListeners({
      onSelectRange: Actions.selectRange,
      onClearSelectedRange: Actions.clearSelectedRange,
      onParseData: Actions.parseData,
      onSetValue: Actions.setValue,
      onSetViewPort: Actions.setViewPort
    });

    this.state = {
      selectedRange: [],
      data: Map({}),
      headerWidths: [],
      colNums: 0,
      rowNums: 0
    };
  }

  onSelectRange(range){
    if(isArray(range))
      this.setState({selectedRange: range});
    else
      this.setState({selectedRange: [range]});
  }

  onClearSelectedRange(){
    this.setState({selectedRange: []});
  }

  onParseData(params){
    let [data, headers, headerWidths] = params
    this.setState({data: data, headerWidths: headerWidths});
  }

  onSetValue(valueAndRange){
    let [value, ranges] = valueAndRange;
    let {data} = this.state;
    if(!isArray(ranges)) ranges = [ranges];
    for(let range of ranges){
      let {startRow, stopRow, startCol, stopCol} = range;
      for(let row = startRow; row <= stopRow; row++){
        if(!data.get(row)) data = data.set(row, Map({}));
        for(let col = startCol; col <= stopCol; col++){
          if(value){
             let rowData = data.get(row);
             rowData = rowData.set(col, value);
             data = data.set(row, rowData);
          }
        }
      }
    }
    this.setState({data: data});
  }

  onSetViewPort(params){
    let [rowNums, colNums] = params;
    this.setState({rowNums: rowNums, colNums: colNums});
  }

}

export default alt.createStore(Store, "Store");