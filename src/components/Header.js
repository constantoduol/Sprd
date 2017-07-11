import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    title: PropTypes.string
  }

  render(){
    let style = {width: this.props.width};
    return <th style={style}>{this.props.title}</th>
  }
}