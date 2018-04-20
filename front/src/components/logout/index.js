import React from 'react';
import { Button } from 'antd';

import Style from './index.module.css';

/**
 * @todo The auth should be handled here instead of asking for a callback,+
 */
export default ({ onClick }) => <section className={Style.Logout}>
    <Button type="secondary" onClick={onClick}>Logout</Button>
</section>;
