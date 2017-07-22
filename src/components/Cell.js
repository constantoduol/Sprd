import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import connectToStores from 'alt-utils/lib/connectToStores';
import Store from '../Store';
import Actions from '../Actions';

@connectToStores
export default class Cell extends React.Component {

  static propTypes = {
    headerWidth: PropTypes.number,
    row: PropTypes.number,
    col: PropTypes.number
  };

  constructor(props){
    super(props);
    this.CELL_MODES = {
      INACTIVE: "inactive", 
      ACTIVE: "active", 
      EDITING: "editing"
    };

    this.state = {
      mode: this.CELL_MODES.INACTIVE
    };

    this.cellClicked = this.cellClicked.bind(this);
    this.cellDoubleClicked = this.cellDoubleClicked.bind(this);
    this.cellKeyDown = this.cellKeyDown.bind(this);
    this.inputNotActive = this.inputNotActive.bind(this);
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  inputNotActive(){
    this.setState({mode: this.CELL_MODES.INACTIVE});
  }

  cellClicked(){
    let {row, col} = this.props;
    Actions.selectRange(new Range(row, col, row, col));
  }

  cellDoubleClicked(){
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    })
  }

  cellKeyDown(){
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    });
  }

  currentCellStyle(){
    switch(this.state.mode){
      case this.CELL_MODES.INACTIVE:
        return styles.td_inactive;
      case this.CELL_MODES.ACTIVE:
        return styles.td_active;
      case this.CELL_MODES.EDITING:
        return styles.td_editing;
    }
  }

  renderInnerCell(){
    return (
      <input 
        type='text' 
        onBlur={this.inputNotActive}
        ref={(input) => { this.input = input; }}
        style={styles.input_active}/>
    );
  }
  
  render(){
    return (
      <td 
        onDoubleClick={this.cellDoubleClicked}
        onKeyDown={this.cellKeyDown}
        onClick={this.cellClicked}
        style={this.currentCellStyle()}>
        {this.state.mode === this.CELL_MODES.EDITING ? this.renderInnerCell() : null}
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
    zIndex: 100
  },
  input_inactive: {
    border: "none",
    borderStyle: "none",
    padding: 0,
    margin: 0,
    textAlign: "right"
  },
  td_active: {
    border: "2px solid #2196F3",
  },
  td_inactive: {
    border: "1px solid #BDBDBD",
  },
  td_editing: {
   border: "2px solid #2196F3"
  }
}