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
      onSetFocusedCell: Actions.setFocusedCell,
      onDragStarted: Actions.dragStarted,
      onDragStopped: Actions.dragStopped,
      onAddDragZone: Actions.addDragZone
    });

    this.NO_FOCUSED_CELL = new SprdRange(-1,-1,-1,-1);

    this.state = {
      selectedRange: [],
      valueSetRange: [], //range of where data changed
      focusedCell: this.NO_FOCUSED_CELL,
      data: Map(),
      headerWidths: [],
      dragging: false, //current drag highlighting on going?
      dragOrigin: null,
      dragZone: {}, //cells in the drag zone
      cols: 0,
      rows: 0,
      maxCol: 0, //the max column we have reached
      maxRow: 0, //the max row we have reached
      minCol: 0, //rendering of headers starts from minCol to minCol + cols
      minRow: 0 //rendering of rows starts from minRow to minRow + rows
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
    this.setState({
      data: data, 
      headerWidths: headerWidths, 
      rows: rows, 
      cols: cols
    });
  }

  onSetFocusedCell(range){
    this.setState({focusedCell: range});
  }

  onDragStarted(origin){
    this.state.dragZone = {};
    this.addDragZone(origin);
    let {dragZone} = this.state;
    this.setState({dragging: true, dragZone: dragZone});
    
  }

  onDragStopped(end){
    this.addDragZone(end);
    this.setState({dragging: false});
  }

  onAddDragZone(range){
    this.addDragZone(range);
    let {dragZone} = this.state;
    let selectedRange = [SprdRange.toSingleRange(Object.values(dragZone))];
    this.setState({dragZone: dragZone, selectedRange: selectedRange}); 
  }

  addDragZone(range){
    let rangeString = range.toString();
    let {dragZone} = this.state;
    if(dragZone[rangeString]) return;
    dragZone[rangeString] = range; //should we use an immutable?
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
          if(value) data = data.setIn([row, col], value)
        }
      }
    }
    this.setState({data: data, valueSetRange: ranges});
  }

  onSetViewPort(params){
    let [minRow, minCol] = params;
    this.setState({
      minRow: minRow, 
      minCol: minCol
    });
  }

}

export default alt.createStore(Store, "Store");