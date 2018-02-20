import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import Mousetrap from 'mousetrap';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import SprdNavigator from '../SprdNavigator';
import {DIRECTION, OUT_OF_RANGE_CELL} from '../Constants';


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
    dragOrigin: PropTypes.object
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
  }

  componentDidMount(){
    console.log("cell mount")
    Mousetrap(this.input).bind(["enter", "down"], () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props, DIRECTION.DOWN);
    });

    Mousetrap(this.input).bind("left", () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props, DIRECTION.LEFT);
    });

    Mousetrap(this.input).bind("right", () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props, DIRECTION.RIGHT);
    });

    Mousetrap(this.input).bind("up", () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props, DIRECTION.UP);
    });

    this.maybeChangeCellMode(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.maybeChangeCellMode(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState){
    let {mode, value} = this.state;
    return nextState.mode !== mode || nextState.value !== value;
  }

  maybeChangeCellMode(props){
    let {mode} = this.state;
    let {ranges, row, col, dragging} = props;
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
    let {row, col} = this.props;
    Actions.dragStarted(new SprdRange(row, col, row, col));
  }

  mouseUp(){
    let {row, col} = this.props;
    Actions.dragStopped(new SprdRange(row, col, row, col));
  }

  mouseOver(){
    let {dragging} = this.props;
    if(dragging){
      let {row, col} = this.props;
      Actions.addDragZone(new SprdRange(row, col, row, col));
    }
  }

  //this is called twice when cell is double clicked
  //to prevent that we check if the current cell is already selected
  cellClicked(){
    let {row, col, ranges} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    let thisCellSelected = clickSelectedRange.isCellSelected(row, col);
    if(!thisCellSelected)
      Actions.setRange({clickSelectedRange: new SprdRange(row, col, row, col)});
  }

  cellDoubleClicked(){
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    })
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

  inputValueChanged(e){
    let value = e.target.value;
    this.setState({value}, () => {
      let {row, col} = this.props;
      Actions.setValue(value, new SprdRange(row, col, row, col));
    });
  }


  renderInnerCell(){
    let {mode, value} = this.state;
    return (
      <input 
        key={0}
        onChange={this.inputValueChanged}
        hidden={mode !== this.CELL_MODES.EDITING}
        type='text' 
        value={value}
        ref={(input) => { this.input = input; }}
        style={styles.input_active}/>
    );
  }

  renderOuterCell(){
    let {mode, value} = this.state;
    let textAlign = typeof value === "number" ? "right" : "left";
    let style = merge({textAlign}, styles.outer_cell);
    return (
      <div 
        key={1}
        hidden={mode === this.CELL_MODES.EDITING}
        style={style}>
          {this.state.value}
      </div>
    );
  }
  
  render(){
    //console.log("cell re-render");
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
    fontSize: 14
  }
}