export default ({
    home: { path: '/', title: 'Home', module: import('./pages/home') },
    counter: { path: '/counter', title: 'Counter', module: import('./pages/counter')},
    messages: { path: '/messages', title: 'Messages', module: 'pages/messages' },
    bmi: { path: '/bmi', title: 'BMI', module: import('./pages/bmi')},
    todo: { path: '/todo', title: 'ToDo', module: 'pages/todo'},
    // TODO: Incomplete, seems like feathers-cycle does not support .on on 0.0.2
    //       where's the version I was working on? who knows.
    socket: { path: '/socket', title: 'Socket', module: 'pages/socket'}
});