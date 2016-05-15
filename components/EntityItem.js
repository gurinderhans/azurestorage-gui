import React from 'react'
import DateTimeField from './DateTimeField'

export default class EntityItem extends React.Component {

	constructor(props) {
		super(props);
		
		this.fieldKeyOnChange = this.fieldKeyOnChange.bind(this);
		this.fieldValOnChange = this.fieldValOnChange.bind(this);
		this.fieldTypeOnChange = this.fieldTypeOnChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	fieldKeyOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: ev.target.value, 
				val: this.props.item.val, 
				type: this.props.item.type
			},
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		});
	}

	fieldValOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: this.props.item.key, 
				val: (ev.target.value || ev.target.getAttribute('data-value')), 
				type: this.props.item.type
			}, 
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		});
	}

	fieldTypeOnChange(ev) {
		this.props.onEntityItemChange({
			item: {
				key: this.props.item.key, 
				val: '', // clear value on type change
				type: ev.target.getAttribute('data-value')
			},
			entityItemId: this.props.entityItemId, 
			entityId: this.props.entityId
		});
	}

	onDelete() {
		this.props.onEntityItemDelete(this.props.entityId ,this.props.entityItemId);
	}

	render() {

		let entityItemValueField;
		if (this.props.item.type === 'boolean') {
			entityItemValueField = (
				<div className="input-group-btn">
					<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{String(this.props.item.val)} <span className="caret"></span></button>
					<ul className="dropdown-menu">
						<li onClick={this.fieldValOnChange}><a data-value="true">true</a></li>
						<li onClick={this.fieldValOnChange}><a data-value="false">false</a></li>
					</ul>
				</div>
			);
		} else if (this.props.item.type === 'datetime') {
			entityItemValueField = <DateTimeField className="form-control" dateValStr={this.props.item.val} key={this.props.item.type} fieldValOnChange={this.fieldValOnChange} />
		} else if (this.props.item.type === 'number') {
			entityItemValueField = (<input className="form-control" key={this.props.item.type} type='number' placeholder='Value' value={this.props.item.val} onChange={this.fieldValOnChange} />);
		} else {
			entityItemValueField = (<input className="form-control" key={this.props.item.type} type='text' placeholder='Value' value={this.props.item.val} onChange={this.fieldValOnChange} />);
		}

		return (
			<div className="input-group" style={{marginBottom: 10 + 'px'}}>
				<input value={this.props.item.key} onChange={this.fieldKeyOnChange} className="form-control" type="text" placeholder="Prop" />
				<span className="input-group-addon" style={{padding: 0, border: 'none', width:0 + 'px'}}></span>
				{entityItemValueField}
				<div className="input-group-btn">
					<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.props.item.type} <span className="caret"></span></button>
					<ul className="dropdown-menu">
						<li onClick={this.fieldTypeOnChange}><a data-value="string">string</a></li>
						<li onClick={this.fieldTypeOnChange}><a data-value="number">number</a></li>
						<li onClick={this.fieldTypeOnChange}><a data-value="datetime">datetime</a></li>
						<li onClick={this.fieldTypeOnChange}><a data-value="boolean">boolean</a></li>
					</ul>
					<button className="btn btn-danger" onClick={this.onDelete}><i className="fa fa-trash" aria-hidden="true"></i></button>
				</div>
			</div>
		);
	}
}