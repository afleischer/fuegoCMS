import IndexSort from './IndexSort'

//const list = [7, "71.1", 1, 2.4, 10.8, 11, "3.1.2.3.4", 2.11];
const list = [6, 6.3, 6.2, 7.1, 6.4, 7, 8, 9, 10, 11, 12, 13];
//const sorted_list = [1, 2.4, 2.11, "3.1.2.3.4", 7, 10.8, 11, "71.1"];
const sorted_list = [6, 6.2, 6.3, 6.4, 7, 7.1, 8, 9, 10, 11, 12, 13];


test("seeing if this works", () => {
	expect(IndexSort(list)).toEqual(sorted_list)
})

