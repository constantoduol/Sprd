import Alt from 'alt';
import Actions from './Actions';
const alt = new Alt();

class Store {

  constructor() {
    this.bindActions(Actions);
    this.selectedColumns = {};
    this.selectedRows = {};
    this.selectedCellRange = {}; 
    this.activeCell = {};
  }

  onSelectSingleColumn(){

  }

  onSelectSingleRow(){

  }

  onSetActiveCell(){

  }


}

export default alt.createStore(Store, "Store");