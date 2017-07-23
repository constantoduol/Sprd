import Alt from 'alt';
import Actions from './Actions';
import alt from './altConfig';

class Store {

  constructor() {
    this.bindListeners({
      onSelectRange: Actions.selectRange
    });

    this.state = {
      selectedRange: []
    };
  }

  onSelectRange(range){
    console.log("on select range");
    this.setState({selectedRange: range});
  }

}

export default alt.createStore(Store, "Store");