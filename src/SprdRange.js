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
  * @ranges - an array consisting of sprd ranges representing the area covered by the drag
  * @dragOrigin - the SprdRange representing the cell where dragging started
  * @recentDragCell - a SprdRange representing the most recent cell covered by dragging, this helps determine the direction
  *                  of drag relative to the drag origin
  */
  static toDragRange(ranges, dragOrigin, recentDragCell){
    let {startCol: originStartCol, stopCol: originStopCol, startRow: originStartRow, stopRow: originStopRow} = dragOrigin;
    let {startCol: recentStartCol, stopCol: recentStopCol, startRow: recentStartRow, stopRow: recentStopRow} = recentDragCell;
    let singleRange = SprdRange.toSingleRange(ranges);

    if(recentStartCol <= originStartCol && recentStartRow >= originStartRow){
      //direction = DIRECTION.BOTTOM_LEFT;
      singleRange.stopCol = originStopCol;
      singleRange.startRow = originStartRow;
      singleRange.startCol = recentStartCol;
      singleRange.stopRow = recentStopRow;
    } else if(recentStartCol <= originStartCol && recentStartRow <= originStartRow){
      //direction = DIRECTION.TOP_LEFT;
      singleRange.stopRow = originStopRow;
      singleRange.stopCol = originStopCol;
      singleRange.startCol = recentStartCol;
      singleRange.startRow = recentStartRow;
    } else if(recentStartCol >= originStartCol && recentStartRow <= originStartRow){
      //direction = DIRECTION.TOP_RIGHT;
      singleRange.startCol = originStartCol;
      singleRange.stopRow = originStopRow;
      singleRange.startRow = recentStartRow;
      singleRange.stopCol = recentStopCol;
    } else if(recentStartCol >= originStartCol && recentStartRow >= originStartRow){
      //direction = DIRECTION.BOTTOM_RIGHT;
      singleRange.startCol = originStartCol;
      singleRange.startRow = originStartRow;
      singleRange.stopRow = recentStopRow;
      singleRange.stopCol = recentStopCol;
    }

    return singleRange;
  }

  /**
  * verifies whether the current cell is within the given range
  */
  isWithinRange(range){
    let {startRow, startCol, stopRow, stopCol} = range;
    return this.startRow >= startRow && this.stopRow <= stopRow && this.startCol >= startCol && this.stopCol <= stopCol;
  }

}