//renamed from Range to distinguish from window.Range
export default class SprdRange {

  constructor(startRow, startCol, stopRow, stopCol){
    this.startRow = startRow;
    this.startCol = startCol;
    this.stopRow = stopRow;
    this.stopCol = stopCol; 
  }

  isNumberCellSelected(row){
    return this.startCol === 0 && this.stopCol === -1 && this.startRow === row;
  }

  isCellSelected(row, col){
    return this.startRow === row && this.startCol === col && this.stopRow === row && this.stopCol === col;
  }

  isHeaderSelected(col){
    return this.startCol === col && this.stopCol === col && this.startRow === -1 && this.stopRow === -1;
  }

  isEqual(otherRange){
    let {startRow, stopRow, startCol, stopCol} = otherRange;
    if(startRow === this.startRow && stopRow === this.stopRow && startCol === this.startCol && stopCol === this.stopCol)
      return true
    return false;
  }

  //verify whether a list of two ranges is the same
  static areEqual(ranges1, ranges2){
    let allFound = true;
    for(let range1 of ranges1){
      let oneFound = true;
      for(let range2 of ranges2){
         oneFound = oneFound && range1.isEqual(range2);
         if(oneFound) break;
      }
      allFound = allFound && oneFound; 
    }
    return allFound;
  }

}