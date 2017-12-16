//renamed from Range to distinguish from window.Range
export default class SprdRange {

  constructor(startRow, startCol, stopRow, stopCol){
    this.startRow = startRow;
    this.startCol = startCol;
    this.stopRow = stopRow;
    this.stopCol = stopCol; 
  }

  isNumberCellSelected(range){
    let {startRow} = range;
    return this.startCol === 0 && this.stopCol === -1 && this.startRow === startRow;
  }

  isCellSelected(range){
    let {startCol, startRow, stopRow, stopCol} = range;
    return this.startRow === startRow && this.startCol === startCol && this.stopRow === stopRow && this.stopCol === stopCol;
  }

  isHeaderSelected(range){
    let {startCol} = range;
    return this.startCol === startCol && this.stopCol === startCol && this.startRow === -1 && this.stopRow === -1;
  }

  isEqual(otherRange){
    let {startRow, stopRow, startCol, stopCol} = otherRange;
    return startRow === this.startRow 
          && stopRow === this.stopRow 
          && startCol === this.startCol 
          && stopCol === this.stopCol;
  }

  //verify whether a list of two ranges is the same
  static areEqual(ranges1, ranges2){
    if(ranges1.length !== ranges2.length) return false;
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

  toString(){
    let {startCol, stopCol, startRow, stopRow} = this;
    if(startCol === stopCol && startRow === stopRow)
      return `${startRow}_${startCol}`;
    return `${startRow}_${startCol}_${stopRow}_${stopCol}`;
  }

  /**
  * finds one range that covers all the ranges
  * @ranges - an array of SprdRange objects
  */
  static toSingleRange(ranges){
    let minRow = Number.MAX_SAFE_INTEGER, minCol = Number.MAX_SAFE_INTEGER, maxRow = 0, maxCol = 0;
    for(let range of ranges){
      let {startCol, stopCol, startRow, stopRow} = range;
      if(startCol < minCol) minCol = startCol;
      if(stopCol > maxCol) maxCol = stopCol;

      if(startRow < minRow) minRow = startRow;
      if(stopRow > maxRow) maxRow = stopRow;
    }

    return new SprdRange(minRow, minCol, maxRow, maxCol);
  }

  /**
  * returns a range with the drag origin as the extremity
  */
  static toDragRange(ranges, dragOrigin){

  }

  /**
  * verifies whether the current cell is within the given range
  */
  isWithinRange(range){
    let {startRow, startCol, stopRow, stopCol} = range;
    return this.startRow >= startRow && this.stopRow <= stopRow && this.startCol >= startCol && this.stopCol <= stopCol;
  }

}