import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import Mousetrap from 'mousetrap';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import SprdNavigator from '../SprdNavigator';
import SprdContainer from '../SprdContainer';
import {DIRECTION, EVENT, DATA_TYPE} from '../Constants';


export default class Cell extends React.Component {

  static propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    minRow: PropTypes.number,
    minCol: PropTypes.number,
    rows: PropTypes.number,
    cols: PropTypes.number,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    width: PropTypes.number,
    selectedRange: PropTypes.array,
    dragging: PropTypes.bool,
    dragOrigin: PropTypes.object,
    dataType: PropTypes.string
  };

  constructor(props){
    super(props);
    this.CELL_MODES = {
      INACTIVE: "inactive", 
      ACTIVE: "active", 
      EDITING: "editing",
      HORIZONTAL_HIGHLIGHT: "horizontal_higlight",
      VERTICAL_HIGHLIGHT: "vertical_higlight",
      DRAG_HIGHLIGHT: "drag_highlight"
    };

    this.state = {
      mode: this.CELL_MODES.INACTIVE,
      value: this.props.value
    };

    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseOver = this.mouseOver.bind(this);

    this.cellClicked = this.cellClicked.bind(this);
    this.cellDoubleClicked = this.cellDoubleClicked.bind(this);
    this.inputValueChanged = this.inputValueChanged.bind(this);

    this.mouseCurrentlyUp = true; //we use this to prevent false triggers to dragstarted
    this.MOUSE_DOWN_DELAY = 200; //delay until we are sure the user is actually dragging
  }

  componentDidMount(){
    console.log("cell mount")
    Mousetrap(this.input).bind("enter", () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props, DIRECTION.DOWN);
    });

    this.maybeChangeCellMode(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.maybeChangeCellMode(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState){
    let {mode} = this.state;
    return nextState.mode !== mode || nextProps.value !== this.props.value;
  }

  maybeChangeCellMode(props){
    let {mode} = this.state;
    let {ranges, row, col} = props;
    let currentCellRange = new SprdRange(row, col, row, col);
    let {focusedCellRange, clickSelectedRange, 
        dragSelectedRange, dragOriginCellRange} = SprdRange.fromImmutable(null, ranges); 

    if(currentCellRange.isCellSelected(dragOriginCellRange)){
      this.setState({mode: this.CELL_MODES.ACTIVE});
      return;
    } else if(currentCellRange.isWithinRange(dragSelectedRange)){
      this.setState({mode: this.CELL_MODES.DRAG_HIGHLIGHT});
      return
    }

    if(focusedCellRange.isCellSelected(currentCellRange)){
      this.cellDoubleClicked();
      return;
    } 
      
    if(clickSelectedRange.isCellSelected(currentCellRange)){
      this.setState({mode: this.CELL_MODES.ACTIVE});
    } else if(clickSelectedRange.isNumberCellSelected(currentCellRange)){
      this.setState({mode: this.CELL_MODES.HORIZONTAL_HIGHLIGHT});
    } else if(clickSelectedRange.isHeaderSelected(currentCellRange)){
      this.setState({mode: this.CELL_MODES.VERTICAL_HIGHLIGHT});
    } else if(mode !== this.CELL_MODES.INACTIVE){
      this.setState({mode: this.CELL_MODES.INACTIVE});
    }
    
  }

  mouseDown(){
    let {row, col, onEvent} = this.props;
    this.mouseCurrentlyUp = false;
    setTimeout( () => { //use this to prevent false triggering of dragging when someone clicks this cell
      if(!this.mouseCurrentlyUp){
        let dragOrigin = new SprdRange(row, col, row, col);
        Actions.dragStarted(dragOrigin);
        SprdContainer.eventTriggered(onEvent, EVENT.DRAG_STARTED, dragOrigin);
      }
    }, this.MOUSE_DOWN_DELAY);
  }

  mouseUp(){
    let {row, col, dragging, onEvent} = this.props;
    if(dragging){
      let dragEndPos = new SprdRange(row, col, row, col)
      Actions.dragStopped(dragEndPos);
      SprdContainer.eventTriggered(onEvent, EVENT.DRAG_STOPPED, dragEndPos);
    }
    this.mouseCurrentlyUp = true; //clicked on the same cell, and now the mouse has come up
  }

  mouseOver(){
    let {dragging, row, col, ranges, onEvent} = this.props;
    if(dragging){
      let dragSelectedRange = SprdRange.fromImmutable('dragSelectedRange', ranges);
      Actions.addDragZone(new SprdRange(row, col, row, col));
      SprdContainer.eventTriggered(onEvent, EVENT.DRAG_IN_PROGRESS, dragSelectedRange);
    }
  }

  //this is called twice when cell is double clicked
  //to prevent that we check if the current cell is already selected
  cellClicked(){
    let {row, col, ranges, onEvent} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    let clickPos = new SprdRange(row, col, row, col);
    let thisCellSelected = clickSelectedRange.isCellSelected(clickPos);
    if(!thisCellSelected){
      Actions.setRange({clickSelectedRange: clickPos});
      SprdContainer.eventTriggered(onEvent, EVENT.CELL_CLICKED, clickPos);
    }
  }

  cellDoubleClicked(){
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    });
    let {row, col, onEvent} = this.props;
    SprdContainer.eventTriggered(onEvent, EVENT.CELL_DOUBLE_CLICKED, new SprdRange(row, col, row, col));
  }

  currentStyle(){
    switch(this.state.mode){
      case this.CELL_MODES.INACTIVE:
        return styles.td_inactive;
      case this.CELL_MODES.ACTIVE:
        return styles.td_active;
      case this.CELL_MODES.EDITING:
        return styles.td_editing;
      case this.CELL_MODES.HORIZONTAL_HIGHLIGHT:
        return styles.td_horizontal_highlight;
      case this.CELL_MODES.VERTICAL_HIGHLIGHT:
        return styles.td_vertical_highlight;
      case this.CELL_MODES.DRAG_HIGHLIGHT:
        return styles.td_drag_highlight;
    }
  }

  isNumber(value){
    let isNum = typeof value === DATA_TYPE.NUMBER;
    return isNum || !isNaN(Number(value));
  }

  getValueDataType(value){
    let {dataType} = this.props;
    if(dataType) return dataType; 
    if(this.isNumber(value)) return DATA_TYPE.NUMBER;
    return DATA_TYPE.STRING;
  }

  inputValueChanged(e){
    let value = e.target.value;
    let {row, col, onEvent} = this.props;
    let pos = new SprdRange(row, col, row, col);
    Actions.setValue(value, pos);
    SprdContainer.eventTriggered(onEvent, EVENT.CELL_VALUE_CHANGED, pos);
  }


  renderInnerCell(){
    let {mode} = this.state;
    return (
      <input 
        key={0}
        onChange={this.inputValueChanged}
        hidden={mode !== this.CELL_MODES.EDITING}
        type='text' 
        value={this.props.value}
        ref={(input) => { this.input = input; }}
        style={styles.input_active}/>
    );
  }

  renderOuterCell(){
    let {mode} = this.state;
    let {value} = this.props;
    let valueDataType = this.getValueDataType(value);
    let textAlign = valueDataType === DATA_TYPE.NUMBER ? "right" : "left";
    let style = merge({textAlign}, styles.outer_cell);
    return (
      <div 
        key={1}
        hidden={mode === this.CELL_MODES.EDITING}
        style={style}>
          {value}
      </div>
    );
  }
  
  render(){
    let {width} = this.props;
    let style = merge(this.currentStyle(), {width});
    return (
      <td 
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
        onMouseOver={this.mouseOver}
        onDoubleClick={this.cellDoubleClicked}
        onClick={this.cellClicked}
        style={style}>
          {[this.renderInnerCell(), this.renderOuterCell()]}
      </td>
    )
  }
}

const styles = {
  input_active: {
    border: "none",
    borderStyle: "none",
    width: "95%",
    padding: 0,
    margin: 0,
    zIndex: 100,
    fontSize:14
  },
  td_horizontal_highlight: {
    borderTop: "1px solid #2196F3",
    borderBottom: "1px solid #2196F3",
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    background: "rgba(33, 150, 243, 0.1)"
  },
  td_vertical_highlight: {
    borderLeft: "1px solid #2196F3",
    borderRight: "1px solid #2196F3",
    borderTop: "1px solid #BDBDBD",
    borderBottom: "1px solid #BDBDBD",
    background: "rgba(33, 150, 243, 0.1)"
  },
  td_drag_highlight: {
    borderTop: "1px solid #BDBDBD",
    borderBottom: "1px solid #BDBDBD",
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    background: "rgba(33, 150, 243, 0.1)"
  },
  td_active: {
    border: "2px solid #2196F3",
  },
  td_inactive: {
    borderTop: "1px solid #BDBDBD",
    borderLeft: "1px solid #BDBDBD",
  },
  td_editing: {
   border: "2px solid #2196F3"
  },
  outer_cell: {
    fontSize: 14,
    padding: 2
  }
}