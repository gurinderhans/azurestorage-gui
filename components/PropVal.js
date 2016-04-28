import React from 'react';

const PropVal = React.createClass({
	fieldChange() {
		//
	},

	render() {
		return (
			<div>
				<input type='text' placeholder='Prop' value={this.props.propKey} onChange={this.fieldChange} />
				<input type='text' placeholder='Value' value={this.props.propVal} onChange={this.fieldChange} />
			</div>
		);
	}
});

module.exports = PropVal;