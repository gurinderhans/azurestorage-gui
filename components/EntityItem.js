import React from 'react'

const EntityItem = React.createClass({
	getInitialState() {
		return {
			key: '',
			val: '',
			type: 'string'
		}
	},

	componentWillMount() {
		this.setState({
			key: this.props.entityItem.key,
			val: this.props.entityItem.val,
			type: this.props.entityItem.type
		});
	},

	componentWillReceiveProps(nextProps) {
		this.setState({
			key: nextProps.entityItem.key,
			val: nextProps.entityItem.val,
			type: nextProps.entityItem.type
		});
	},

	entityItemKeyChangeHandler(event) {
		this.setState({
			key: event.target.value,
		});

		this.props.entityItemChangeHandler(this.props.id, event.target.value, this.state.val, this.state.type);
	},

	entityItemValueChangeHandler(event) {
		this.setState({
			val: event.target.value,
		});

		this.props.entityItemChangeHandler(this.props.id, this.state.key, event.target.value, this.state.type);
	},

	entityItemTypeChangeHandler(event) {
		this.setState({
			type: event.target.value,
			val: '',
		});

		this.props.entityItemChangeHandler(this.props.id, this.state.key, this.state.val, event.target.value);
	},

	render() {
		const allowEntityItemInputEditing = (this.state.key === 'PartitionKey' || this.state.key === 'RowKey' || this.state.key === 'Timestamp');

		let entityItemValueField;
		if (this.state.type === 'boolean') {
			entityItemValueField = (
				<select value={this.state.val} onChange={this.entityItemValueChangeHandler}>
					<option value='true'>True</option>
					<option value='false'>False</option>
				</select>
			);
		} else if (this.state.type === 'datetime') {
			let date = this.state.val ? new Date(this.state.val) : new Date();
			entityItemValueField = (<input key={this.state.type} type='datetime-local' value={date.toISOString().slice(0,-1)} onChange={this.entityItemValueChangeHandler} />);
		} else if (this.state.type === 'number') {
			entityItemValueField = (<input key={this.state.type} type='number' placeholder='Value' value={this.state.val} onChange={this.entityItemValueChangeHandler} />);
		} else {
			entityItemValueField = (<input key={this.state.type} type='text' placeholder='Value' value={this.state.val} onChange={this.entityItemValueChangeHandler} />);
		}

		return (
			<div>
				<input type='text' placeholder='Prop' value={this.state.key} onChange={this.entityItemKeyChangeHandler} readOnly={allowEntityItemInputEditing} />
				
				{entityItemValueField}
				
				<select value={this.state.type} onChange={this.entityItemTypeChangeHandler} disabled={allowEntityItemInputEditing}>
					<option value='string'>String</option>
					<option value='number'>Number</option>
					<option value='datetime'>Date</option>
					<option value='boolean'>Boolean</option>
				</select>
				<button onClick={this.props.deleteEntityItemHandler.bind(null, this.props.id)}>Delete</button>
			</div>
		);
	}
});

module.exports = EntityItem;