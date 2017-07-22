import Alt from 'alt';
import Actions from './Actions';
const alt = new Alt();

class Store {

  constructor() {
    this.selectedRange = {};
    this.bindListeners({
      handleSelectRange: Actions.SELECT_RANGE
    });
  }

  handleSelectRange(range){
    console.log("on select range");
    this.selectedRange = range;
  }

}

export default alt.createStore(Store, "Store");