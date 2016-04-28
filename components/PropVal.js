import React from 'react';

const PropVal = React.createClass({
	getInitialState() {
		return {
			propKey: this.props.propKey || '',
			propVal: this.props.propVal || ''
		}
	},

	handlePropChange(event) {
		this.setState({
			propKey: event.target.value,
		})
	},

	handleValueChange(event) {
		this.setState({
			propVal: event.target.value,
		})
	},

	render() {
		return (
			<div>
				<input type='text' placeholder='Prop' value={this.state.propKey} onChange={this.handlePropChange} />
				<input type='text' placeholder='Value' value={this.state.propVal} onChange={this.handleValueChange} />
			</div>
		);
	}
});

module.exports = PropVal;