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

	handlePropKeyChange(event) {
		this.setState({
			propKey: event.target.value,
		});

		this.props.onChange(this.props.id, event.target.value, this.state.propVal);
	},

	handleValKeyChange(event) {
		this.setState({
			propVal: event.target.value,
		});

		this.props.onChange(this.props.id, this.state.propKey, event.target.value);
	},

	render() {
		const propKey = this.state.propKey || '';
		const propVal = this.state.propVal || '';

		return (
			<div>
				<input type='text' placeholder='Prop' value={propKey} onChange={this.handlePropKeyChange} />
				<input type='text' placeholder='Value' value={propVal} onChange={this.handleValKeyChange} />
			</div>
		);
	}
});

module.exports = PropVal;