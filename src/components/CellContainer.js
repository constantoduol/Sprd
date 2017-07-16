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
    let {data, headerWidths} = this.props;
    let allRows = [];
    for(let row = 0; row < maxRow; row++){
      let currentRow = [];
      for(let col = 0; col < maxCol; col++){
        currentRow.push(<Cell headerWidth={headerWidths[col]} key={row + "_" + col}/>);
      }
      let rowStyle = {height: data[row]['height']};
      allRows.push(<tr style={rowStyle} key={row}>{currentRow}</tr>);
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
