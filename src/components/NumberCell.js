import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import {eventTriggered} from '../Util';
import {EVENT} from '../Constants';

export default class NumberCell extends React.Component {

  static propTypes = {
    row: PropTypes.number,
    width: PropTypes.number,
    ranges: PropTypes.object
  }

  constructor(props){
    super(props);
    this.numberCellClicked = this.numberCellClicked.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', nextProps.ranges);
    let currClickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', this.props.ranges);
    return this.numberCellIsActive(clickSelectedRange) || this.numberCellIsActive(currClickSelectedRange);
  }

  numberCellIsActive(range){
    let {startRow, stopRow} = range;
    return startRow === stopRow && stopRow === this.props.row;
  }

  numberCellClicked(){
    let {row, onEvent} = this.props;
    let pos = new SprdRange(row, 0, row, -1);
    Actions.setRange({clickSelectedRange: pos});
    eventTriggered(onEvent, EVENT.NUMBER_CELL_CLICKED, pos);
  }

  currentStyle(){
    let {ranges, width} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    if(this.numberCellIsActive(clickSelectedRange))
      return styles.numberCellSelected;
    return merge(styles.numberCell, {width});
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