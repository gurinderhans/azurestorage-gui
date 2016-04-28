import React from 'react';

const PropVal = React.createClass({
	getInitialState() {
		return {
			propKey: '',
			propVal: ''
		}
	},

	componentWillMount() {
		this.setState({
			propKey: this.props.propKey,
			propVal: this.props.propVal
		});
	},

	componentWillReceiveProps(newProps) {
		if (this.state.propKey != newProps.propKey || this.state.propVal != newProps.propVal) {
			this.setState({
				propKey: newProps.propKey,
				propVal: newProps.propVal
			});
		}
	},

	handlePropChange(event) {
		this.setState({
			propKey: event.target.value,
		});
	},

	handleValueChange(event) {
		this.setState({
			propVal: event.target.value,
		});
	},

	render() {
		const propKey = this.state.propKey || '';
		const propVal = this.state.propVal || '';

		return (
			<div>
				<input type='text' placeholder='Prop' value={propKey} onChange={this.handlePropChange} />
				<input type='text' placeholder='Value' value={propVal} onChange={this.handleValueChange} />
			</div>
		);
	}
});

module.exports = PropVal;