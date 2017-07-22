import React from 'react';
import PropTypes from 'prop-types';
import {merge} from 'lodash';

export default class Header extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    title: PropTypes.string
  }

  constructor(props){
    super(props);
    this.state = {
      width: this.props.width
    };
  }

  headerClicked(){
    
  }

  render(){
    let style = {width: this.state.width};
    style = merge(style, styles.header);
    return (
      <th style={style}>
        {this.props.title}
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
    userSelect: "none"
  }
}