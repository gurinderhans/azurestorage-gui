import React from 'react'

const EntityItem = React.createClass({

	fieldKeyOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: ev.target.value, 
				val: this.props.item.val, 
				type: this.props.item.type
			},
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		})
	},

	fieldValOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: this.props.item.key, 
				val: ev.target.value, 
				type: this.props.item.type
			}, 
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		})
	},

	fieldTypeOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: this.props.item.key, 
				val: this.props.item.val, 
				type: ev.target.value
			}, 
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		})
	},

	onDelete() {
		this.props.onEntityItemDelete(this.props.entityId ,this.props.entityItemId)
	},

	render() {
		return (
			<div>
				<input type='text' placeholder='Prop' value={this.props.item.key} onChange={this.fieldKeyOnChange} />
				<input type='text' placeholder='Value' value={this.props.item.val} onChange={this.fieldValOnChange} />
				<select value={this.props.item.type} onChange={this.fieldTypeOnChange}>
					<option value='string'>String</option>
					<option value='number'>Number</option>
					<option value='datetime'>Date</option>
					<option value='boolean'>Boolean</option>
				</select>
				<button onClick={this.onDelete}>Delete</button>
			</div>
		);
	}
});

module.exports = EntityItem;