import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import connectToStores from 'alt-utils/lib/connectToStores';

import Actions from '../Actions';
import SprdRange from '../SprdRange';

export default class Header extends React.Component {

  static propTypes = {
    col: PropTypes.number,
    title: PropTypes.string,
    selectedRange: PropTypes.array,
    width: PropTypes.number
  }

  constructor(props){
    super(props);
    this.headerClicked = this.headerClicked.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState){
    for(let range of nextProps.selectedRange){
      if(this.headerIsActive(range)) return true;
    }
    for(let range of this.props.selectedRange){
      if(this.headerIsActive(range)) return true;
    }
    return false;
  }

  headerIsActive(range){
    let {startCol, stopCol} = range;
    if(startCol === stopCol && stopCol === this.props.col)
      return true;
  }

  headerClicked(){
    let {col} = this.props;
    Actions.selectRange(new SprdRange(-1, col, -1, col));
  }

  currentStyle(){
    let {selectedRange, width} = this.props;
    let style = {width: width};
    for(let range of selectedRange){
      if(this.headerIsActive(range))
        return merge(style, styles.headerSelected);
    }
    return merge(style, styles.header);
  }

  render(){
    console.log("header re-render")
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