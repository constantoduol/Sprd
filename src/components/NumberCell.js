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

  numberCellClicked(){
    let {row} = this.props;
    Actions.selectRange(new SprdRange(row, 0, row, -1));
  }

  currentStyle(){
    let {selectedRange, row} = this.props;
    for(let range of selectedRange){
      if(range && range.isNumberCellSelected(row))
        return styles.numberCellSelected;
    }
    return styles.numberCell;
  }

  render(){
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
    userSelect: "none"
  }
}