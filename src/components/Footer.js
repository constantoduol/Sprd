import React from 'react';
import {merge} from 'lodash';
import PropTypes from 'prop-types';

export default class Footer extends React.Component {

  static propTypes = {
    width: PropTypes.number,
  };

  render(){
    let {width} = this.props;
    let style = merge(styles.footer, {width});
    return (
      <div style={style}>Footer</div>
    )
  }
}

const styles = {
  footer: {
    background: "#E0E0E0",
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    borderLeft: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    position: "fixed"
  }
}

