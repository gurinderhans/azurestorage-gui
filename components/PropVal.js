import React from 'react';

const PropVal = React.createClass({

	render() {
		return (
			<div>
				<input type='text' placeholder='Prop' defaultValue={this.props.propKey} />
				<input type='text' placeholder='Value' defaultValue={this.props.propVal} />
			</div>
		);
	}
});

module.exports = PropVal;