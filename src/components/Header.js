import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import {DEFAULT_HEADER_WIDTH} from '../Constants';

export default class Header extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    title: PropTypes.string
  }

  constructor(props){
    super(props);
    this.headerResizeStarted = this.headerResizeStarted.bind(this);
    this.headerResizeStopped = this.headerResizeStopped.bind(this);
    this.RESIZE_MODES = {RESIZING: "resizing", STILL: "still"};
    this.state = {
      resizeMode: this.RESIZE_MODES.STILL
    };
  }

  headerResizeStarted(){
    this.setState({resizeMode: this.RESIZE_MODES.RESIZING});
  }

  headerResizeStopped(){
    console.log("dragging stopped");
  }

  resizeStyle(){
    let resizeStyle = {left: this.props.width * 0.9};
    switch(this.state.resizeMode){
      case this.RESIZE_MODES.STILL:
        return merge(styles.resize_still, resizeStyle);
      case this.RESIZE_MODES.RESIZING:
        return merge(styles.resize_resizing, resizeStyle);
    }
  }

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.header);
    return (
      <th style={style}>
        {this.props.title}
        <div 
          onDragEnd={this.headerResizeStopped}
          onDragStart={this.headerResizeStarted}
          className="resize" 
          style={this.resizeStyle()}></div>
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
    position: "relative"
  },
  resize_still: {
    height: 20,
    cursor: "col-resize",
    width: 5,
    position: "absolute",
    top: 0
  },
  resize_resizing: {
    height: 600,
    cursor: "col-resize",
    width: 1,
    position: "absolute",
    top: 0,
    background: "#2196F3"
  }
}