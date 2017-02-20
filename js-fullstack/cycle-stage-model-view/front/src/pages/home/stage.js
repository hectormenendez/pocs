import $ from 'xstream';
import {Component} from '../../helpers/smv';

export default function Stage(source){

    const component = {};
    component.navigation = Component({ source, path:'components/navigation' });

    const intent = {};

    return { intent, component };
}
