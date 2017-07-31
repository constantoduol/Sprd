import Actions from './Actions';
import alt from './altConfig';
import {isArray} from 'lodash';

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
      data: {},
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
    let [value, range] = valueAndRange;

  }

  onSetViewPort(params){
    let [rowNums, colNums] = params;
    this.setState({rowNums: rowNums, colNums: colNums});
  }

}

export default alt.createStore(Store, "Store");