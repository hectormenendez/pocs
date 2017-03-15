import $ from 'xstream';

export default function Model({ intent, component, sink }){

    const initial = {};

    // Configure the Navigation component and get its sinks.
    const navigation = component.navigation({
        title: 'Money',
        items: [
            { title: 'router', href:'#/examples/router' },
            { title: 'bmi', href:'#/examples/bmi' },
            { title: 'socket', href:'#/examples/socket' },
            { title: 'todo', href:'#/examples/todo' },
            { title: 'Hola', href:'http://google.com' },
        ]
    });

    // Return the sinks
    return {
        State: $.merge($.of(initial), navigation.State),
        DOM: navigation.DOM,
        Router: $.merge(sink.Router, navigation.Router),
    }
}
