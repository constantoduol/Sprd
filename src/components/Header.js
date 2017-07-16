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
    style = merge(style, styles.header);
    return (
      <th style={style}>
        {this.props.title}
        <div style={styles.resize}></div>
      </th>
    );
  }
}

const styles = {
  header: {
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    fontSize: 12,
    fontWeight: 500
  },
  resize: {
    height: 20,
    float: "right",
    cursor: "col-resize",
    width: 10
  }
}