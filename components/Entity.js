import React from 'react'
import EntityItem from './EntityItem'

export default class Entity extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="col-md-6 entitygrid-item">
				<div className="panel panel-default">
					<div className="panel-heading">
						<div className="input-group">
							<div className="btn-group">
								<button onClick={this.props.onEntityItemAdd.bind(null, this.props.entityId)} className="btn btn-sm btn-primary"><i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Item</button>
								<button onClick={this.props.onEntitySave.bind(null, this.props.entityId)} className="btn btn-sm btn-success"><i className="fa fa-floppy-o" aria-hidden="true"></i>&nbsp;Save</button>
								<button onClick={this.props.onEntityDelete.bind(null, this.props.entityId)} className="btn btn-sm btn-danger"><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete</button>
							</div>
						</div>
					</div>
					<div className="panel-body">
						{this.props.data.map((item, i) => {
							return <EntityItem key={i} item={item} entityItemId={i} entityId={this.props.entityId} onEntityItemChange={this.props.onEntityItemChange} onEntityItemDelete={this.props.onEntityItemDelete} />;
						})}
					</div>
				</div>
			</div>
		);
	}
}

Entity.defaultProps = { data: [] };