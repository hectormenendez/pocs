import React from 'react';

export default ({ name, message }) => <section>
    <h2>{ name || 'Error' }</h2>
    {message && <p>{ message }</p>}
</section>;
