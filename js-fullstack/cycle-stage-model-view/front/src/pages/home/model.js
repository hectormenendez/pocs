import $ from 'xstream';

export default function Model({ intent, component }){

    const navigation = {};

    navigation.component$ = component.navigation({
        title: 'Money',
        opts : [
            { title: 'Test', href:'/hola/mundo' },
        ]
    });

    navigation.state$ = navigation.component$
        .map(component => component.state$)
        .flatten()
        .map(state => ({ navigation: state }));

    navigation.vnode$ = navigation.component$
        .map(component => component.DOM)
        .flatten()
        .map(vnode => ({ Navigation: () => vnode }));

    const state$ = navigation.state$.startWith({});
    const vnode$ = navigation.vnode$;

    return { state$, vnode$ }
}
