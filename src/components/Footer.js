import React from 'react';
import {merge} from 'lodash';
import PropTypes from 'prop-types';

import {FOOTER_HEIGHT, SCROLL_BAR_WIDTH} from '../Constants';

export default class Footer extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    content: PropTypes.string
  };

  render(){
    let {width, content} = this.props;
    let style = merge(styles.footer, {width: width + SCROLL_BAR_WIDTH - 2});
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

