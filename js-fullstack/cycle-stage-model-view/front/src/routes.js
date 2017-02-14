import Root   from './pages/examples/router';
import Todo   from './pages/examples/todo';
import Bmi    from './pages/examples/bmi';
import Socket from './pages/examples/socket';

export default ({

    '/'       : Socket,
    '/todo'   : Todo,
    '/bmi'    : Bmi,

})
