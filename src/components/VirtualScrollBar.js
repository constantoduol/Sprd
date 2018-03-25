import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';
import Draggable from 'react-draggable';

import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH, SCROLL_DIRECTION} from '../Constants';

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
    furthestRow: PropTypes.number
  };

  shouldShowScollbars(){
    let {minRow, minCol} = this.props;
    let showVertical = minRow > 0;
    let showHorizontal = minCol > 0;
    return {showVertical, showHorizontal};
  }

  getScrollBarLength(){
    return 50;
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
      bounds = {top: 0, bottom: height - FOOTER_HEIGHT - SCROLL_BAR_WIDTH - scrollBarLength};
    } else {
      areaStyle = styles.scroll_area_horizontal;
      scrollerStyle = styles.scroller_horizontal;
      scrollerStyle = merge({width: scrollBarLength, display: showHorizontal ? "block" : "none"}, scrollerStyle);
      axis = "x";
      bounds = {left: 0, right: width  - FOOTER_HEIGHT - SCROLL_BAR_WIDTH - scrollBarLength};
    }
  
    return (
      <div style={areaStyle}>
        <Draggable axis={axis} bounds={bounds}>
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
