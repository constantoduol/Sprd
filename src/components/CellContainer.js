import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import NumberCell from './NumberCell';


export default class CellContainer extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    rowNums: PropTypes.number,
    colNums: PropTypes.number,
    headerWidths: PropTypes.array
  };

  renderCells(){
    let rowNums = this.props.rowNums;
    let colNums = this.props.colNums;
    let {data, headerWidths} = this.props;
    let allRows = [];
    for(let row = 0; row < rowNums; row++){
      let currentRow = [];
      let rowStyle = {height: data[row]['height']};
      currentRow.push(<NumberCell row={row}/>);
      for(let col = 0; col < colNums; col++){
        currentRow.push(
          <Cell 
            headerWidth={headerWidths[col]} 
            row={row} 
            col={col} 
            key={row + "_" + col}/>
          );
      }
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

