import React from 'react'

const EntityItem = React.createClass({
	getInitialState() {
		return {
			key: '',
			val: '',
			type: ''
		}
	},

	componentWillMount() {
		this.setState({
			key: this.props.entityItemKey,
			val: this.props.entityItemVal,
			type: this.props.entityItemType
		});
	},

	componentWillReceiveProps(nextProps) {
		if (this.state.key != nextProps.entityItemKey || this.state.val != nextProps.entityItemVal || this.state.type != nextProps.entityItemType) {
			this.setState({
				key: nextProps.entityItemKey,
				val: nextProps.entityItemVal,
				type: nextProps.entityItemType
			});
		}
	},

	handlekeyChange(event) {
		this.setState({
			key: event.target.value,
		});

		this.props.onChangeHandler(this.props.id, event.target.value, this.state.val, this.state.type);
	},

	handleValKeyChange(event) {
		this.setState({
			val: event.target.value,
		});

		this.props.onChangeHandler(this.props.id, this.state.key, event.target.value, this.state.type);
	},

	handleTypeChange(event) {
		this.setState({
			type: event.target.value
		});

		this.props.onChangeHandler(this.props.id, this.state.key, this.state.val, event.target.value);
	},

	render() {
		const key = this.state.key || '';
		const val = this.state.val || '';
		const type = this.state.type || '';
		const allowKeyTypeEditing = (key === 'PartitionKey' || key === 'RowKey');

		return (
			<div>
				<input type='text' placeholder='Prop' value={key} onChange={this.handlekeyChange} readOnly={allowKeyTypeEditing} />
				<input type='text' placeholder='Value' value={val} onChange={this.handleValKeyChange} />
				<select value={type} onChange={this.handleTypeChange} disabled={allowKeyTypeEditing}>
					<option value='string'>String</option>
					<option value='number'>Number</option>
					<option value='datetime'>Date</option>
					<option value='boolean'>Boolean</option>
				</select>
				<button onClick={this.props.onDeleteHandler.bind(null, this.props.id)}>Delete</button>
			</div>
		);
	}
});

module.exports = EntityItem;