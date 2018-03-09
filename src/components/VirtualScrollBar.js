import React from 'react';
import PropTypes from 'prop-types';

import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH, SCROLL_DIRECTION} from '../Constants';

export default class VirtualScrollBar extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    scroll: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number
  };

  shouldShowScollbars(){
    let {minRow, minCol} = this.props;
    let showVertical = minRow > 0;
    let showHorizontal = minCol > 0;
    return {showVertical, showHorizontal};
  }

  render(){
    let {scroll, height, width} = this.props;
    let areaStyle, scrollerStyle;
    let {showVertical, showHorizontal} = this.shouldShowScollbars();

    if(scroll === SCROLL_DIRECTION.VERTICAL){
      areaStyle = styles.scroll_area_vertical;
      scrollerStyle = styles.scroller_vertical;
      areaStyle.height = height - FOOTER_HEIGHT;
      areaStyle.left = width + 5;
      scrollerStyle.display = showVertical ? "block" : "none";
    } else {
      areaStyle = styles.scroll_area_horizontal;
      scrollerStyle = styles.scroller_horizontal;
      scrollerStyle.display = showHorizontal ? "block" : "none";
    }

    return (
      <div style={areaStyle}>
        <div style={scrollerStyle}></div>
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
    width: 50
  },
  scroller_vertical: {
    height: 50,
    background: "gray",
    width: SCROLL_BAR_WIDTH
  }
}
