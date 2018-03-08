import React from 'react';
import PropTypes from 'prop-types';

import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH} from '../Constants';

export default class VirtualScrollBar extends React.Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    minCol: PropTypes.number,
    minRow: PropTypes.number,
    scroll: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
  };

  render(){
    let {scroll, height, width} = this.props;
    let areaStyle = scroll == "vertical" ? styles.scroll_area_vertical : styles.scroll_area_horizontal;
    let scrollerStyle = scroll == "vertical" ? styles.scroller_vertical : styles.scroller_horizontal;
 
    if(scroll === "vertical"){
      areaStyle.height = height - FOOTER_HEIGHT;
      areaStyle.top = -height + 8;
      areaStyle.left = width + 5;
    }
    return (
      <div style={areaStyle}>
        <div style={scrollerStyle}></div>
      </div>
    )
  }
}

const styles = {
  scroll_area_horizontal: {background: "#eee"},
  scroll_area_vertical: {
    background: "#eee",
    width: SCROLL_BAR_WIDTH,
    position: "relative",
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
