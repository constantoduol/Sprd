import Actions from './Actions';
import alt from './altConfig';
import {isArray} from 'lodash';

class Store {

  constructor() {
    this.bindListeners({
      onSelectRange: Actions.selectRange,
      onClearSelectedRange: Actions.clearSelectedRange
    });

    this.state = {
      selectedRange: []
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

}

export default alt.createStore(Store, "Store");