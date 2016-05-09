import React from 'react'
import EntityItem from './EntityItem'

export default class Entity extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div>
					<button onClick={this.props.onEntityItemAdd.bind(null, this.props.entityId)} >Add Entity Item</button>&nbsp;
					<button onClick={this.props.onEntitySave.bind(null, this.props.entityId)}>Save Entity</button>&nbsp;
					<button onClick={this.props.onEntityDelete.bind(null, this.props.entityId)}>Delete Entity</button>
				</div>
				<div>
					{this.props.data.map((item, i) => {
						return <EntityItem key={i} item={item} entityItemId={i} entityId={this.props.entityId} onEntityItemChange={this.props.onEntityItemChange} onEntityItemDelete={this.props.onEntityItemDelete} />;
					})}
				</div>
				<hr />
			</div>
		);
	}
}

Entity.defaultProps = { data: [] };