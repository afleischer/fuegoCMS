//import firebase, {sortedPagesSnapshot} from '../../firebase'
import * as firebase from '../../firebase';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

//import jest from '../../jest';
import IndexHTMLGivenDBData from './JSXIndexGivenFBDataAlgorithm'

Enzyme.configure({ adapter: new Adapter() });

/*=============
Set up firebase mock. This will be factored into a separate file once I 
confirm it's working. 
==============*/

var firebasemock    = require('firebase-mock');

var mockauth = new firebasemock.MockAuthentication();
var mockdatabase = new firebasemock.MockFirebase();
var mockfirestore = new firebasemock.MockFirestore();
var mockstorage = new firebasemock.MockStorage();
var mockmessaging = new firebasemock.MockMessaging();




/*============
Mock sortedPagesSnapshot firebase data
=============*/

//There's some file that needs to reference Jest.  Which? 

/*
jest.mock(sortedPagesSnapshot, () => {
	return mocksdk;
});

mocksdk.database().flush();
// data is logged

MockFirebase.override();

*/
describe('it runs', () => {

	beforeAll(function(){
	firebase.firebase   = jest.fn().mockReturnValue({
		
	'-90120982038901283': {
		tag_name : 'p',
		tag_placement : 1,
		tag_attributes : "display: block;",
		tag_content : "foo"
	},

	'8675309' : {
		tag_name : 'p',
		tag_placement : 1,
		tag_attributes : "display: block;",
		tag_content : "foo"
	}


	});
});
	it('Should return something', () =>{
		console.log("TagName is:"+TagName);
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

