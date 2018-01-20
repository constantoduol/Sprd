import alt from './altConfig';
import {isArray} from 'lodash';
import {Map} from 'immutable';

import Actions from './Actions';
import SprdRange from './SprdRange';

const OUT_OF_RANGE_CELL = new SprdRange(-1,-1,-1,-1);

class Store {

  constructor() {
    this.bindListeners({
      onSetRange: Actions.setRange,
      onParseData: Actions.parseData,
      onSetValue: Actions.setValue,
      onSetViewPort: Actions.setViewPort,
      onDragStarted: Actions.dragStarted,
      onDragStopped: Actions.dragStopped,
      onAddDragZone: Actions.addDragZone
    });


    this.state = {
      ranges: Map({
        clickSelectedRange: OUT_OF_RANGE_CELL, //range selected by user click actions
        dragSelectedRange: OUT_OF_RANGE_CELL, //range selected by user drag actions
        focusedCellRange: OUT_OF_RANGE_CELL, //a range representing a single cell that is the currently focused cell
        recentDragCellRange: OUT_OF_RANGE_CELL, //range representing a single cell that was most recently covered when dragging
        dragOriginCellRange: OUT_OF_RANGE_CELL //range representing a single cell that is the origin of dragging
      }),
      valueSetRange: [], //range of where data changed
      data: Map(),
      headerWidths: [],
      dragging: false, //current drag highlighting on going?
      dragZone: {}, //cells in the drag zone
      cols: 0,
      rows: 0,
      minCol: 0, //rendering of headers starts from minCol to minCol + cols
      minRow: 0 //rendering of rows starts from minRow to minRow + rows
    };

  }

  onSetRange(rangesToSet){
    let {ranges} = this.state;
    for(let [key, range] of Object.entries(rangesToSet)){
      let currentRange = ranges.get(key);
      if(!currentRange) continue;
      ranges = ranges.set(key, range);
    }
    this.setState({ranges});
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

  onDragStarted(origin){
    this.state.dragZone = {};
    this.addDragZone(origin);
    let {dragZone, ranges} = this.state;
    
    this.setState({dragging: true, dragZone: dragZone, dragOrigin: origin});
  }

  onDragStopped(end){
    this.addDragZone(end);
    this.setState({dragging: false});
  }

  onAddDragZone(range){
    this.addDragZone(range);
    let {dragZone, dragOrigin} = this.state;
    let selectedRange = [SprdRange.toDragRange(Object.values(dragZone), dragOrigin, range)];
    this.setState({dragZone: dragZone, selectedRange: selectedRange, recentDragCell: range}); 
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