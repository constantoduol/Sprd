import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import {DEFAULT_HEADER_WIDTH} from '../Constants';
import Draggable from './Draggable';

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
      resizeMode: this.RESIZE_MODES.STILL,
      left: this.props.width * 0.9,
      previousPos: 0
    };
  }

  headerResizing(pos){
    let {left, previousPos} = this.state
    console.log(pos.x, previousPos);
    let newLeft = pos.x >= previousPos ? left + 0.4 : left - 0.4;
    this.setState({
      resizeMode: this.RESIZE_MODES.RESIZING, 
      left: newLeft,
      previousPos: pos.x
    });
  }

  headerResizeStarted(e){
    console.log("resize started");
    this.setState({resizeMode: this.RESIZE_MODES.RESIZING});
  }

  headerResizeStopped(e){
    console.log("resize stopped");
  }

  resizeStyle(){
    let resizeStyle = {left: this.state.left};
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
        <Draggable onMove={pos => this.headerResizing(pos)}>
          <div 
            className="resize" 
            style={this.resizeStyle()}></div>
        </Draggable>
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