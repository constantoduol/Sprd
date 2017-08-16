import alt from './altConfig';
import {isArray} from 'lodash';
import {Map} from 'immutable';

import Actions from './Actions';
import SprdRange from './SprdRange';


class Store {

  constructor() {
    this.bindListeners({
      onSelectRange: Actions.selectRange,
      onClearSelectedRange: Actions.clearSelectedRange,
      onParseData: Actions.parseData,
      onSetValue: Actions.setValue,
      onSetViewPort: Actions.setViewPort,
      onSetFocusedCell: Actions.setFocusedCell
    });

    this.NO_FOCUSED_CELL = new SprdRange(-1,-1,-1,-1);

    this.state = {
      selectedRange: [],
      focusedCell: this.NO_FOCUSED_CELL,
      data: Map(),
      headerWidths: [],
      cols: 0,
      rows: 0
    };

  }

  onSelectRange(range){
    if(isArray(range))
      this.setState({selectedRange: range, focusedCell: this.NO_FOCUSED_CELL});
    else
      this.setState({selectedRange: [range], focusedCell: this.NO_FOCUSED_CELL});
  }

  onClearSelectedRange(){
    this.setState({selectedRange: []});
  }

  onParseData(params){
    let [data, headers, headerWidths, rows, cols] = params
    this.setState({data, headerWidths, rows, cols});
  }

  onSetFocusedCell(range){
    this.setState({focusedCell: range});
  }

  onSetValue(valueAndRange){
    let [value, ranges] = valueAndRange;
    let {data} = this.state;
    if(!isArray(ranges)) ranges = [ranges];
    for(let range of ranges){
      let {startRow, stopRow, startCol, stopCol} = range;
      for(let row = startRow; row <= stopRow; row++){
        if(!data.get(row)) data = data.set(row, Map());
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
    let [rows, cols] = params;
    this.setState({rows, cols});
  }

}

export default alt.createStore(Store, "Store");