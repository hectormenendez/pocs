import $ from 'xstream';

export default function Model({ intent, component, sink }){

    const initial = {};

    const navigation$ = component.navigation({
        title: 'Money',
        items: [
            { title: 'router', href:'#/examples/router' },
            { title: 'bmi', href:'#/examples/bmi' },
            { title: 'socket', href:'#/examples/socket' },
            { title: 'todo', href:'#/examples/todo' },
            { title: 'Hola', href:'http://google.com' },
        ]
    });

    // Prepare the navigation component sinks
    const navigation = {};
    navigation.State = navigation$
        .map(component => component.State)
        .flatten()
        .map(state => ({ navigation: state }));

    navigation.DOM = navigation$
        .map(component => component.DOM)
        .flatten()
        .map(vtree => ({ Navigation: () => vtree }));

    navigation.Router = navigation$
        .map(component => component.Router)
        .flatten()

    // navigation.Router.subscribe({ error: e => {}, next: router => { debugger } });
    // Return the sinks
    return {
        State: $.merge($.of(initial), navigation.State),
        DOM: navigation.DOM,
        Router: $.merge(sink.Router, navigation.Router),
    }
}
