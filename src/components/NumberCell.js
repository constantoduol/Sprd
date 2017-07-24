import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../Actions';
import SprdRange from '../SprdRange';
import Store from '../Store';
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
export default class NumberCell extends React.Component {

  static propTypes = {
    row: PropTypes.number
  }

  constructor(props){
    super(props);
    this.numberCellClicked = this.numberCellClicked.bind(this);
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
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