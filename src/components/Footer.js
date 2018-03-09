import React from 'react';
import {merge} from 'lodash';
import PropTypes from 'prop-types';

import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH} from '../Constants';

export default class Footer extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    content: PropTypes.string,
    showScrollBars: PropTypes.bool
  };

  render(){
    let {width, content, showScrollBars} = this.props;
    let widthCorrection = showScrollBars ? SCROLL_BAR_WIDTH - 2 : 0;
    let style = merge(styles.footer, {width: width + widthCorrection});
    return (
      <div style={style}>{content}</div>
    )
  }
}

const styles = {
  footer: {
    background: "#E0E0E0",
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    border: "1px solid #BDBDBD",
    position: "fixed",
    height: FOOTER_HEIGHT
  }
}
