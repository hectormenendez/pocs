var React = require('react');

module.exports = React.createClass({
	render:function(){

		var notes = this.props.notes.map((note, i)=>{
			return (
				<li className='list-group-item' key={i}>
					{note['.value']}
				</li>
			)
		});

		return(
			<ul className='list-group'>
				{notes}
			</ul>
		)
	}
})