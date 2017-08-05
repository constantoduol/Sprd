import React from 'react';
import {merge, difference} from 'lodash';
import Mousetrap from 'mousetrap';
import connectToStores from 'alt-utils/lib/connectToStores';

import Footer from './components/Footer';
import HeaderContainer from './components/HeaderContainer';
import CellContainer from './components/CellContainer';
import FormulaBar from './components/FormulaBar';
import Actions from './Actions';
import SprdRange from './SprdRange';
import Store from './Store';
import SprdNavigator from './SprdNavigator';
import {DIRECTION} from './Constants';

@connectToStores
export default class Sprd extends React.Component {

  static getStores() {
    return [Store];
  }

  static getPropsFromStores() {
    return Store.getState();
  }

  componentDidMount(){
    this.setupKeyBindings();
  }


  shouldComponentUpdate(nextProps, nextState){
    //there was a change in data
    if(!nextProps.focusedCell.isEqual(this.props.focusedCell)) return true;
    if(nextProps.data !== this.props.data) return true;
    //there was a change in header widths
    let shouldUpdate = !SprdRange.areEqual(nextProps.selectedRange, this.props.selectedRange);
    if(shouldUpdate) return true;
    return difference(nextProps.headerWidths, this.props.headerWidths).length > 0;
  }

  setupKeyBindings(){
    Mousetrap.bind(["ctrl+c", "command+c"], () => {
      console.log("copy");
    });
    Mousetrap.bind(["ctrl+v", "command+v"], () => {
      console.log("paste");
    });
    Mousetrap.bind("up", () => {
      SprdNavigator.move(this.props.selectedRange, DIRECTION.UP);
    });
    Mousetrap.bind("down", () => {
      SprdNavigator.move(this.props.selectedRange, DIRECTION.DOWN);
    });
    Mousetrap.bind("right", () => {
      SprdNavigator.move(this.props.selectedRange, DIRECTION.RIGHT);
    });
    Mousetrap.bind("left", () => {
      SprdNavigator.move(this.props.selectedRange, DIRECTION.LEFT);
    });    
    Mousetrap.bind("enter", () => {
      Actions.setFocusedCell(this.props.selectedRange[0]);
    });  
  }

  render(){
    let style = {width: this.props.width};
    style = merge(style, styles.root);
    let {
      colNums, rowNums, showFormulaBar, headerWidths, 
      selectedRange, showHeaderLetters, data, focusedCell} = this.props;
    return (
      <div style={style}>
        {showFormulaBar ? <FormulaBar/> : null}
        <table style={styles.table}>
          <HeaderContainer
            colNums={colNums}
            headerWidths={headerWidths}
            selectedRange={selectedRange}
            showHeaderLetters={showHeaderLetters}/>
          <CellContainer 
            colNums={colNums} 
            data={data}
            selectedRange={selectedRange}
            focusedCell={focusedCell}
            rowNums={rowNums}/>
        </table>
        <Footer/>
      </div>
    )
  }
}

const styles = {
  table: {
    width: "100%",
    maxWidth: "100%",
    borderCollapse: "collapse",
    borderSpacing: 0
  },
  root: {
    borderTop: "1px solid #BDBDBD",
    borderBottom: "1px solid #BDBDBD",
    borderRight: "1px solid #BDBDBD",
    margin: 5
  }
}