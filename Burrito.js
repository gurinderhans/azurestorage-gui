// var React = require('react');
import React from 'react';

function Burrito(props) {
  'use strict';

  return (<div className={props.name}>{props.ingredients && props.ingredients.join(', ')}</div>);
}

Burrito.defaultProps = {
  name: 'burrito',
  ingredients: []
};

Burrito.propTypes = {
  name: React.PropTypes.string,
  ingredients: React.PropTypes.array
};

module.exports = Burrito;