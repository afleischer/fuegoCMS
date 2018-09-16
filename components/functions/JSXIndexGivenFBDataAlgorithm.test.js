import firebase, {sortedPagesSnapshot} from '../../firebase'
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import jest from '../../jest';
import {IndexHTMLGivenDBData} from './JSXIndexGivenFBDataAlgorithm'

Enzyme.configure({ adapter: new Adapter() });


/*============
Mock sortedPagesSnapshot firebase data
=============*/

jest.mock(sortedPagesSnapshot, () => {
	return mocksdk;
});

mocksdk.database().flush();
// data is logged

MockFirebase.override();

describe('it runs', () => {
	it('Should return something', () =>{
		expect(IndexHTMLGivenDBData()).toEqual(expect.anything());
	});
});

/* 
		beforeAll(function() {
		 sortedPagesSnapshot = jest.fn().mockReturnValue({
		 currentUser: true,
		 signOut: function() { return true; }
		 });


*/

