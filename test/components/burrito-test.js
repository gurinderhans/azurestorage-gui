import React from 'react'
import jsdom from 'jsdom'
import { expect } from 'chai'
import { mount, shallow } from 'enzyme'

import App from '../../components/App'


/// INITIAL SETUP
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;
global.document = doc;
global.window = win;


describe("<App />", function() {

  describe('Load App ', function () {
    it("loads", function() {
      const wrapper = shallow(<App />);
      console.log('app:',wrapper.text());
      expect(wrapper).to.not.equal(undefined);
    });

    it('calls componentDidMount', () => {
      const wrapper = mount(<App />);
      expect(App.prototype.componentDidMount.calledOnce).to.equal(true);
    });

    // it("renders no text with no props", function() {
    //   var wrapper = shallow(<Burrito ingredients={['chicken', 'beans']} />);
    //   expect(wrapper.text()).to.equal('chicken, beans');
    // });
  });
});

// describe("<Burrito />", function() {

//   describe('Text: ', function () {
//     it("renders no text with no props", function() {
//       var wrapper = shallow(<Burrito />);
//       expect(wrapper.text()).to.equal('');
//     });

//     it("renders no text with no props", function() {
//       var wrapper = shallow(<Burrito ingredients={['chicken', 'beans']} />);
//       expect(wrapper.text()).to.equal('chicken, beans');
//     });
//   });

//   describe('Name: ', function() {
//     it("is named 'burrito' with no props", function() {
//       var wrapper = shallow(<Burrito />);
//       expect(wrapper.hasClass('burrito')).to.equal(true);
//     });

//     it("is named 'the-james-mason' with 'the-james-mason' passed as name", function() {
//       var wrapper = shallow(<Burrito name='the-james-mason' />);
//       expect(wrapper.hasClass('the-james-mason')).to.equal(true);
//     });

//   });
// });