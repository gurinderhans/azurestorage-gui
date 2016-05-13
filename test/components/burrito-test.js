var React = require('react');
var expect = require('chai').expect;
var enzyme = require('enzyme');
var Burrito = require('../../Burrito');

describe("<Burrito />", function() {

  describe('Text: ', function () {
    it("renders no text with no props", function() {
      var wrapper = enzyme.shallow(<Burrito />);
      expect(wrapper.text()).to.equal('');
    });

    it("renders no text with no props", function() {
      var wrapper = enzyme.shallow(<Burrito ingredients={['chicken', 'beans']} />);
      expect(wrapper.text()).to.equal('chicken, beans');
    });
  });

  describe('Name: ', function() {
    it("is named 'burrito' with no props", function() {
      var wrapper = enzyme.shallow(<Burrito />);
      expect(wrapper.hasClass('burrito')).to.equal(true);
    });

    it("is named 'the-james-mason' with 'the-james-mason' passed as name", function() {
      var wrapper = enzyme.shallow(<Burrito name='the-james-mason' />);
      expect(wrapper.hasClass('the-james-mason')).to.equal(true);
    });

  });
});