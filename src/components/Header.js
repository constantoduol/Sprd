import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import connectToStores from 'alt-utils/lib/connectToStores';
import Actions from '../Actions';
import Store from '../Store';
import SprdRange from '../SprdRange';

//it is debatable whether we should listen to store here or in header container
@connectToStores
export default class Header extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    col: PropTypes.number,
    title: PropTypes.string
  }

  constructor(props){
    super(props);
    this.state = {
      width: this.props.width
    };
    this.headerClicked = this.headerClicked.bind(this);
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  headerClicked(){
    let {col} = this.props;
    Actions.selectRange(new SprdRange(-1, col, -1, col));
  }

  currentStyle(){
    let {selectedRange, col} = this.props;
    let style = {width: this.state.width};
    for(let range of selectedRange){
      if(range && range.isHeaderSelected(col))
        return merge(style, styles.headerSelected);
    }
    return merge(style, styles.header);
  }

  render(){
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
    userSelect: "none"
  }
}