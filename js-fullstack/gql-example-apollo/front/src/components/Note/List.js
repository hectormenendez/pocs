import React from 'react';

export default ({ notes }) => <ul>
    {notes.map(({ id: key, content }) => <li key={ key }>{content }</li>)}
</ul>;
