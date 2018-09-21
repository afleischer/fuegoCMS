
const IndexSort = arr => {

	//MergeSort, but with extra comparisons so we can compare numbers to our 
	//version-like strings to numbers
	//i.e if we have [1, 2, 1.1.1, 7.3.2.1, 7, 4.2]
	//then it would sort as: [1, 1.1.1, 2, 4.2, 7, 7.3.2.1]


	if (arr.length === 1) {
		//return once we hit an array with a single item
		return arr;
	}

	const middle = Math.floor(arr.length / 2); //get middle item of array rounded down
	const left = arr.slice(0, middle); //left-side
	const right = arr.slice(middle); //right side

	return Index(
	IndexSort(left),
	IndexSort(right));

};

const Index = (left, right) => {
	let result = [];
	let indexLeft = 0;
	let indexRight = 0;

	while (indexLeft < left.length && indexRight < right.length){
	
		let indexLeftParsed = left[indexLeft].toString().split('.');
		let indexRightParsed = right[indexRight].toString().split('.'); 
		let digit_comparing = 0;
		let maxLength = indexLeftParsed.length >= indexRightParsed.length ? indexLeftParsed.length : indexRightParsed.length;

		for(digit_comparing = 0; digit_comparing < maxLength; digit_comparing++){
			if (indexLeftParsed[digit_comparing] - indexRightParsed[digit_comparing] == 0) {
				//pass
			} else
			if (indexLeftParsed[digit_comparing] - indexRightParsed[digit_comparing] < 0 || (!indexLeftParsed[digit_comparing] && indexRightParsed[digit_comparing])) {
				result.push(left[indexLeft]);
				indexLeft++;
				break;

			} else {
				result.push(right[indexRight]);
				indexRight++;
				break;
			}
		}

	}

	return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
};

//////////////const list = [6, 6.4, 6.3, 7.8, 6.4, 7, 8, 9, 10, 11, 12, 13];
const list = [7, "71.1", 1, 2.4, 10.8, 11, "3.1.2.3.4", 2.11];
////const list = [1, 6, 4.3.2, 10.8, 10, 98.3, 9.8.3]

console.log("Sorted index is:" + IndexSort(list));

export default IndexSort;