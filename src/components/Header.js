import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';

export default class Header extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    title: PropTypes.string
  }

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.th);
    return <th style={style}>{this.props.title}</th>
  }
}

const styles = {
  th: {
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    fontSize: 12,
    fontWeight: 500
  }
}