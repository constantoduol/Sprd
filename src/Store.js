import Actions from './Actions';
import alt from './altConfig';
import {isArray} from 'lodash';

class Store {

  constructor() {
    this.bindListeners({
      onSelectRange: Actions.selectRange,
      onClearSelectedRange: Actions.clearSelectedRange,
      onParseData: Actions.parseData,
      onSetValue: Actions.setValue
    });

    this.state = {
      selectedRange: [],
      data: {},
      headerWidths: []
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

}

export default alt.createStore(Store, "Store");