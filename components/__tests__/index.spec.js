import React from 'react';
import {shallow} from 'enzyme';
import index from '../../index';

describe('index', () => {
  it('should render a <div />', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div').length).toEqual(1);
  });
});


//expect value to equal 