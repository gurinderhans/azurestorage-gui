import React from 'react';

const EntityItem = React.createClass({
	getInitialState() {
		return {
			key: '',
			val: ''
		}
	},

	componentWillMount() {
		this.setState({
			key: this.props.entityItemKey,
			val: this.props.entityItemVal
		});
	},

	componentWillReceiveProps(newProps) {
		if (this.state.key != newProps.entityItemKey || this.state.val != newProps.entityItemVal) {
			this.setState({
				key: newProps.entityItemKey,
				val: newProps.entityItemVal
			});
		}
	},

	handlekeyChange(event) {
		this.setState({
			key: event.target.value,
		});

		this.props.onChangeHandler(this.props.id, event.target.value, this.state.val);
	},

	handleValKeyChange(event) {
		this.setState({
			val: event.target.value,
		});

		this.props.onChangeHandler(this.props.id, this.state.key, event.target.value);
	},

	render() {
		const key = this.state.key || '';
		const val = this.state.val || '';

		return (
			<div>
				<input type='text' placeholder='Prop' value={key} onChange={this.handlekeyChange} readOnly={false} />
				<input type='text' placeholder='Value' value={val} onChange={this.handleValKeyChange} />
				<button onClick={this.props.onDeleteHandler.bind(null, this.props.id)}>Delete</button>
			</div>
		);
	}
});

module.exports = EntityItem;