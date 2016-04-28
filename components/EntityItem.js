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

	componentWillReceiveProps(nextProps) {
		if (this.state.key != nextProps.entityItemKey || this.state.val != nextProps.entityItemVal) {
			this.setState({
				key: nextProps.entityItemKey,
				val: nextProps.entityItemVal
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
		const allowKeyEditing = (key === 'PartitionKey' || key === 'RowKey');

		return (
			<div>
				<input type='text' placeholder='Prop' value={key} onChange={this.handlekeyChange} readOnly={allowKeyEditing} />
				<input type='text' placeholder='Value' value={val} onChange={this.handleValKeyChange} />
				<button onClick={this.props.onDeleteHandler.bind(null, this.props.id)}>Delete</button>
			</div>
		);
	}
});

module.exports = EntityItem;