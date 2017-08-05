import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import Mousetrap from 'mousetrap';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import SprdNavigator from '../SprdNavigator';
import {DIRECTION} from '../Constants';


export default class Cell extends React.Component {

  static propTypes = {
    row: PropTypes.number,
    col: PropTypes.number,
    value: PropTypes.string,
    selectedRange: PropTypes.array
  };

  constructor(props){
    super(props);
    this.CELL_MODES = {
      INACTIVE: "inactive", 
      ACTIVE: "active", 
      EDITING: "editing",
      HORIZONTAL_HIGHLIGHT: "horizontal_higlight",
      VERTICAL_HIGHLIGHT: "vertical_higlight"
    };

    this.state = {
      mode: this.CELL_MODES.INACTIVE,
      value: this.props.value
    };

    this.cellClicked = this.cellClicked.bind(this);
    this.cellDoubleClicked = this.cellDoubleClicked.bind(this);
    this.inputValueChanged = this.inputValueChanged.bind(this);
    this.saveInputValue = this.saveInputValue.bind(this);
  }

  componentDidMount(){
    Mousetrap(this.input).bind("enter", () => {
      this.setState({mode: this.CELL_MODES.INACTIVE});
      SprdNavigator.move(this.props.selectedRange, DIRECTION.DOWN);
    });
  }

  componentWillReceiveProps(nextProps){
    this.maybeChangeCellMode(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState){
    if(nextState.value !== this.state.value) return true;
    return nextState.mode !== this.state.mode;
  }

  maybeChangeCellMode(props){
    let {mode} = this.state;
    let {selectedRange, row, col, focusedCell} = props;
    if(focusedCell.isCellSelected(row, col)){
      this.cellDoubleClicked();
      return;
    }
    for(let range of selectedRange){
      if(range.isCellSelected(row, col)){
        this.setState({mode: this.CELL_MODES.ACTIVE});
      } else if(range.isNumberCellSelected(row, col)){
        this.setState({mode: this.CELL_MODES.HORIZONTAL_HIGHLIGHT});
      } else if(range.isHeaderSelected(col)){
        this.setState({mode: this.CELL_MODES.VERTICAL_HIGHLIGHT});
      } else if(mode !== this.CELL_MODES.INACTIVE){
        this.setState({mode: this.CELL_MODES.INACTIVE});
      }
    }
  }

  //this is called twice when cell is double clicked
  //to prevent that we check if the current cell is already selected
  cellClicked(){
    let {row, col, selectedRange} = this.props;
    let thisCellSelected = false;
    for(let range of selectedRange){
      thisCellSelected =  range.isCellSelected(row, col);
      if(thisCellSelected) break;
    }
    if(!thisCellSelected)
      Actions.selectRange(new SprdRange(row, col, row, col));
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
    }
  }

  inputValueChanged(e){
    this.setState({value: e.target.value});
  }

  saveInputValue(){
    let {row, col} = this.props;
    Actions.setValue(this.state.value, new SprdRange(row, col, row, col));
  }

  renderInnerCell(){
    let {mode, value} = this.state;
    return (
      <input 
        onChange={this.inputValueChanged}
        hidden={mode !== this.CELL_MODES.EDITING}
        type='text' 
        onBlur={this.saveInputValue}
        value={value}
        ref={(input) => { this.input = input; }}
        style={styles.input_active}/>
    );
  }

  renderOuterCell(){
    let {mode, value} = this.state;
    return (
      <div 
        hidden={mode === this.CELL_MODES.EDITING}
        style={styles.outer_cell}>
          {this.state.value}
      </div>
    );
  }
  
  render(){
    console.log("cell re-render");
    return (
      <td 
        onDoubleClick={this.cellDoubleClicked}
        onClick={this.cellClicked}
        style={this.currentStyle()}>
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
    textAlign: "right"
  }
}