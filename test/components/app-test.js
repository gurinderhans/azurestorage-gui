import React from 'react'
import jsdom from 'jsdom'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'

import App from '../../components/App'

describe("<App />", function() {

  describe('Load App ', function () {
    it("loads", function() {
      const wrapper = shallow(<App />);
      expect(wrapper).to.not.equal(undefined);
    });
  });
});