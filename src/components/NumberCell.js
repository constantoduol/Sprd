import React from 'react';
import PropTypes from 'prop-types';

import Actions from '../Actions';
import SprdRange from '../SprdRange';

export default class NumberCell extends React.Component {

  static propTypes = {
    row: PropTypes.number,
    selectedRange: PropTypes.array
  }

  constructor(props){
    super(props);
    this.numberCellClicked = this.numberCellClicked.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    for(let range of nextProps.selectedRange){
      if(this.numberCellIsActive(range)) 
        return true;
    }
    for(let range of this.props.selectedRange){
      if(this.numberCellIsActive(range)) 
        return true;
    }
    return false;
  }

  numberCellIsActive(range){
    let {startRow, stopRow} = range;
    if(startRow === stopRow && stopRow === this.props.row)
      return true;
  }

  numberCellClicked(){
    let {row} = this.props;
    Actions.selectRange(new SprdRange(row, 0, row, -1));
  }

  currentStyle(){
    let {selectedRange} = this.props;
    for(let range of selectedRange){
      if(this.numberCellIsActive(range))
        return styles.numberCellSelected;
    }
    return styles.numberCell;
  }

  render(){
    //console.log("number cell re-render");
    let num = this.props.row + 1;
    return (
      <td style={this.currentStyle()} onClick={this.numberCellClicked} key={num}>
        {num}
      </td>
    );
  }
}

const styles = {
  numberCell: {
    border: "1px solid #BDBDBD",
    fontSize: 14,
    fontWeight: 500,
    background: "#EEEEEE",
    textAlign: "center",
    userSelect: "none"
  },
  numberCellSelected: {
    background: "gray",
    fontSize: 14,
    fontWeight: 500,
    textAlign: "center",
    userSelect: "none",
    color: "white"
  }
}