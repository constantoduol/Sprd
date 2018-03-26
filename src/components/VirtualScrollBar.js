import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import Draggable from 'react-draggable';

import SprdNavigator from '../SprdNavigator';
import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH, SCROLL_DIRECTION, MIN_SCROLLBAR_LENGTH, DIRECTION} from '../Constants';


export default class VirtualScrollBar extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    scroll: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    furthestCol: PropTypes.number,
    furthestRow: PropTypes.number,
    ranges: PropTypes.object,
    infiniteScroll: PropTypes.bool
  };

  constructor(props){
    super(props);
    this.handleDragged = this.handleDragged.bind(this);

  }

  handleDragged(e, data){
    let {ranges, minCol, minRow, rows, cols, infiniteScroll} = this.props;
    let yScrollerDragged = data.x == data.lastX;
    let xScrollerDragged = data.y == data.lastY;

    let yVelocity = 0, xVelocity = 0;
    let yChangeInViewPortPerUnit = 4;
    let xChangeInViewPortPerUnit = 4;
    let dontSetClickSelectedRange = true;

    if(xScrollerDragged){
      xVelocity = data.x - data.lastX;
    } else {
      yVelocity = data.y - data.lastY;
      SprdNavigator.move({ranges, minCol, minRow, rows, cols, infiniteScroll, dontSetClickSelectedRange}, DIRECTION.DOWN);
    }
  }

  shouldShowScollbars(){
    let {furthestRow, furthestCol, rows, cols} = this.props;
    let showVertical = furthestRow > rows;
    let showHorizontal = furthestCol > cols;
    return {showVertical, showHorizontal};
  }

  getScrollBarLength(){
    let {rows, cols, furthestRow, furthestCol, scroll} = this.props;
    furthestRow = furthestRow || 1;
    furthestCol = furthestCol || 1;
    if(scroll === SCROLL_DIRECTION.VERTICAL){
      return Math.max((rows * this.getMaxVerticalScroll())/furthestRow, MIN_SCROLLBAR_LENGTH);
    } else {
      return Math.max((cols * this.getMaxHorizontalScroll())/furthestCol, MIN_SCROLLBAR_LENGTH);
    }
  }

  getMaxVerticalScroll(){
    let {height} = this.props;
    return height - FOOTER_HEIGHT - SCROLL_BAR_WIDTH;
  }

  getMaxHorizontalScroll(){
    let {width} = this.props;
    return width  - FOOTER_HEIGHT - SCROLL_BAR_WIDTH
  }

  render(){
    let {scroll, height, width} = this.props;
    let areaStyle, scrollerStyle, axis, bounds;
    let {showVertical, showHorizontal} = this.shouldShowScollbars();
    let scrollBarLength = this.getScrollBarLength();

    if(scroll === SCROLL_DIRECTION.VERTICAL){
      areaStyle = styles.scroll_area_vertical;
      scrollerStyle = styles.scroller_vertical;
      areaStyle.height = height - FOOTER_HEIGHT;
      areaStyle.left = width + 5;
      scrollerStyle = merge({height: scrollBarLength ,display: showVertical ? "block" : "none"}, scrollerStyle);
      axis = "y";
      bounds = {top: 0, bottom: this.getMaxVerticalScroll() - scrollBarLength};
    } else {
      areaStyle = styles.scroll_area_horizontal;
      scrollerStyle = styles.scroller_horizontal;
      scrollerStyle = merge({width: scrollBarLength, display: showHorizontal ? "block" : "none"}, scrollerStyle);
      axis = "x";
      bounds = {left: 0, right: this.getMaxHorizontalScroll() - scrollBarLength};
    }
  
    return (
      <div style={areaStyle}>
        <Draggable axis={axis} bounds={bounds} onDrag={this.handleDragged}>
          <div style={scrollerStyle}></div>
        </Draggable>
      </div>
    )
  }
}

const styles = {
  scroll_area_horizontal: {
    background: "#eee",
    height: SCROLL_BAR_WIDTH,
    borderLeft: "1px solid #BDBDBD",
  },
  scroll_area_vertical: {
    background: "#eee",
    width: SCROLL_BAR_WIDTH,
    position: "relative",
    top: 5,
    borderTop: "1px solid #BDBDBD",
  },
  scroller_horizontal: {
    height: SCROLL_BAR_WIDTH,
    background: "gray",
  },
  scroller_vertical: {
    background: "gray",
    width: SCROLL_BAR_WIDTH
  }
}
