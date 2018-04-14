import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';

import Actions from '../Actions';
import SprdRange from '../SprdRange';
import SprdContainer from '../SprdContainer';
import {EVENT} from '../Constants';

export default class Header extends React.Component {

  static propTypes = {
    col: PropTypes.number,
    title: PropTypes.string,
    ranges: PropTypes.object,
    width: PropTypes.number
  }

  constructor(props){
    super(props);
    this.headerClicked = this.headerClicked.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', nextProps.ranges);
    let currClickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', this.props.ranges);
    return this.headerIsActive(clickSelectedRange) || this.headerIsActive(currClickSelectedRange);
  }

  headerIsActive(range){
    let {startCol, stopCol} = range;
    return startCol === stopCol && stopCol === this.props.col && startCol > -1;
  }

  headerClicked(){
    let {col, onEvent} = this.props;
    let pos = new SprdRange(-1, col, -1, col);
    Actions.setRange({clickSelectedRange: pos});
    SprdContainer.eventTriggered(onEvent, EVENT.HEADER_CLICKED, pos);
  }

  currentStyle(){
    let {ranges, width} = this.props;
    let clickSelectedRange = SprdRange.fromImmutable('clickSelectedRange', ranges);
    let style = {width: width};
    if(this.headerIsActive(clickSelectedRange))
      return merge(style, styles.headerSelected);
    return merge(style, styles.header);
  }

  render(){
    //console.log("header re-render")
    return (
      <th style={this.currentStyle()} onClick={this.headerClicked}>
        {this.props.title}
      </th>
    );
  }
}

const styles = {
  header: {
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    fontSize: 12,
    fontWeight: 500,
    userSelect: "none"
  },
  headerSelected: {
    background: "gray",
    fontSize: 12,
    fontWeight: 500,
    userSelect: "none",
    color: "white",
    borderRight: "1px solid #2196F3",
    borderLeft: "1px solid #2196F3"
  }
}