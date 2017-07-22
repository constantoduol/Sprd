import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../Actions';
import Range from '../Range';
import Store from '../Store';
import connectToStores from 'alt-utils/lib/connectToStores';

@connectToStores
export default class NumberCell extends React.Component {

  static propTypes = {
    row: PropTypes.number
  }

  constructor(props){
    super(props);
    this.numberCellClicked = this.numberCellClicked.bind(this);
  }

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  numberCellClicked(){
    let {row} = this.props;
    Actions.selectRange(new Range(row, 0, row, -1));
  }

  render(){
    return (
      <td style={styles.numberCell} onClick={this.numberCellClicked}>
        {this.props.row + 1}
      </td>
    );
  }
}

const styles = {
  numberCell: {
    border: "1px solid #BDBDBD",
    fontSize: 14,
    fontWeight: 500,
    background: "#EEEEEE",
    textAlign: "center",
    userSelect: "none"
  }
}