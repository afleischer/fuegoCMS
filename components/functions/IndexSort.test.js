import IndexSort from './IndexSort'

const list = [7, "71.1", 1, 2.4, 10.8, 11, "3.1.2.3.4", 2.11];
const sorted_list = [1, 2.4, 2.11, "3.1.2.3.4", 7, 10.8, 11, "71.1"];

test("seeing if this works", () => {
	expect(IndexSort(list)).toEqual(sorted_list)
})

