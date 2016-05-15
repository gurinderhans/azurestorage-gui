import React from 'react'

export default class DateTimeField extends React.Component {
	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const { datetimepicker } = this.refs;
		$(datetimepicker).datetimepicker({
			format: 'YYYY-MM-DDTHH:mm:ss'
		});

		$(datetimepicker).on("dp.change", ev => {
            this.props.fieldValOnChange(ev)
        });
	}

	render() {
		return (
			<input ref="datetimepicker" className={this.props.className} type="text" value={this.props.dateValStr} onChange={() => {}} />
		);
	}
}
