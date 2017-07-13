import React from 'react';
import Cell from './Cell';
import PropTypes from 'prop-types';

export default class CellContainer extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    maxRow: PropTypes.number,
    maxCol: PropTypes.number,
    headerWidths: PropTypes.array
  };

  renderCells(){
    let maxRow = this.props.maxRow;
    let maxCol = this.props.maxCol;
    let allRows = [];
    for(let row = 0; row < maxRow; row++){
      let currentRow = [];
      for(let col = 0; col < maxCol; col++){
        currentRow.push(<Cell headerWidth={this.props.headerWidths[col]} key={row + "_" + col}/>);
      }
      allRows.push(<tr key={row}>{currentRow}</tr>);
    }
    return allRows;
  }

  render(){
    return (
      <tbody>
        {this.renderCells()}
      </tbody>
    );
  }
}
