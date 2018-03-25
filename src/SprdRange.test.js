import SprdRange from './SprdRange';

test('check whether number cell is selected', () => {
	//startRow, startCol, stopRow, stopCol
	const range1 = new SprdRange(1, 1, 1, 1);
	const range2 = new SprdRange(1, 1, 1, 1);
	const range3 = new SprdRange(1, 0, 1, -1);
	expect(range1.isNumberCellSelected(range2)).toBe(false);
	expect(range3.isNumberCellSelected(range1)).toBe(true);
});

test('check whether a cell is selected', () => {
	//startRow, startCol, stopRow, stopCol
	const range1 = new SprdRange(1, 1, 1, 1);
	const range2 = new SprdRange(1, 1, 1, 1);
	const range3 = new SprdRange(1, 0, 1, -1);
	expect(range1.isCellSelected(range2)).toBe(true);
	expect(range3.isCellSelected(range1)).toBe(false);
});

test('check whether a header is selected', () => {
	//startRow, startCol, stopRow, stopCol
	const range1 = new SprdRange(1, 1, 1, 1);
	const range2 = new SprdRange(1, 1, 1, 1);
	const range3 = new SprdRange(-1, 1, -1, 1);
	expect(range1.isHeaderSelected(range2)).toBe(false);
	expect(range3.isHeaderSelected(range1)).toBe(true);
});

test('check whether 2 ranges are equal', () => {
	//startRow, startCol, stopRow, stopCol
	const range1 = new SprdRange(1, 1, 1, 1);
	const range2 = new SprdRange(1, 1, 1, 1);
	const range3 = new SprdRange(1, 0, 1, -1);
	expect(range1.isEqual(range2)).toBe(true);
	expect(range3.isEqual(range1)).toBe(false);
});

test('check whether a list of ranges is equal', () => {
	//startRow, startCol, stopRow, stopCol
	const listRange1 = [new SprdRange(1, 1, 1, 1), new SprdRange(1, 1, 1, 1), new SprdRange(2, 2, 2, 2)];
	const listRange2 = [new SprdRange(1, 1, 1, 1), new SprdRange(1, 1, 1, 1), new SprdRange(2, 2, 2, 2)];
	const listRange3 = [new SprdRange(1, 1, 1, 1), new SprdRange(2, 2, 2, 2), new SprdRange(1, 1, 1, 1)];
	const listRange4 = [new SprdRange(1, 1, 1, 1), new SprdRange(1, -1, 1, 1), new SprdRange(2, 2, 2, 2)];
	const listRange5 = [new SprdRange(1, 1, 1, 1), new SprdRange(1, 1, 1, 1)];
	expect(SprdRange.areEqual(listRange1, listRange2)).toBe(true);
	expect(SprdRange.areEqual(listRange1, listRange3)).toBe(true);
	expect(SprdRange.areEqual(listRange1, listRange4)).toBe(false);
	expect(SprdRange.areEqual(listRange1, listRange5)).toBe(false);
});
