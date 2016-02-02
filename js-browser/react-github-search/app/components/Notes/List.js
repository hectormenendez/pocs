'use strict';

import React from 'react';

export default ({notes}) => (

	<ul className='list-group'>

		{notes.map((note, i) => (
			<li className='list-group-item' key={i}>
				{note}
			</li>
		))}

	</ul>
)