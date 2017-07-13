import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';

export default class Cell extends React.Component {

  static propTypes = {
    headerWidth: PropTypes.number
  };

  constructor(props){
    super(props);
    this.CELL_MODES = {
      INACTIVE: "inactive", 
      ACTIVE: "active", 
      EDITING: "editing"
    };
    this.state = {
      mode: this.CELL_MODES.INACTIVE,
      height: 15
    };

    this.cellClicked = this.cellClicked.bind(this);
    this.cellDoubleClicked = this.cellDoubleClicked.bind(this);
  }

  cellClicked(){
    this.setState({mode: this.CELL_MODES.ACTIVE});
  }

  cellDoubleClicked(){
    this.setState({mode: this.CELL_MODES.EDITING})
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
    return <input type='text' style={styles.input_active}/>
  }
  
  render(){
    let style = {height: this.state.height};
    style = merge(this.currentCellStyle(), style);
    let {mode} = this.state;
    return (
      <td 
        onDoubleClick={this.cellDoubleClicked}
        onClick={this.cellClicked}
        style={style}>
        {mode === this.CELL_MODES.ACTIVE ? this.renderInnerCell() : null}
      </td>
    )
  }
}

const styles = {
  input_active: {
    border: "2px solid #2196F3",
    width: "95%",
    padding: 0
  },
  td_active: {
    border: "1px solid rgb(189, 189, 189)",
    height: "15px",
    margin: 0,
    padding: 0
  },
  td_inactive: {
    border: "1px solid #BDBDBD",
  },
  td_editing: {
    border: "1px solid #2196F3"
  }
}