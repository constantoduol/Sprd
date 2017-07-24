import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import connectToStores from 'alt-utils/lib/connectToStores';
import Store from '../Store';
import Actions from '../Actions';
import SprdRange from '../SprdRange';

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
      EDITING: "editing",
      HORIZONTAL_HIGHLIGHT: "horizontal_higlight",
      VERTICAL_HIGHLIGHT: "vertical_higlight"
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

  componentWillReceiveProps(nextProps){
    let {selectedRange, row, col} = nextProps;
    for(let range of selectedRange){
      if(range && range.isCellSelected(row, col))
        this.setState({mode: this.CELL_MODES.ACTIVE});
      else if(range && range.isHorizontalHighlight(row, col))
        this.setState({mode: this.CELL_MODES.HORIZONTAL_HIGHLIGHT});
      else if(range && range.isHeaderSelected(col))
        this.setState({mode: this.CELL_MODES.VERTICAL_HIGHLIGHT});
      else
        this.setState({mode: this.CELL_MODES.INACTIVE});
    }
  }



  inputNotActive(){
    Actions.clearSelectedRange();
  }

  cellClicked(){
    let {row, col} = this.props;
    Actions.selectRange(new SprdRange(row, col, row, col));
  }

  cellDoubleClicked(){
    Actions.clearSelectedRange();
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    })
  }

  cellKeyDown(){
    this.setState({mode: this.CELL_MODES.EDITING}, () => {
      this.input.focus();
    });
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
        style={this.currentStyle()}>
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
  }
}