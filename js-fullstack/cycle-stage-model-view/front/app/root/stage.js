import $ from 'xstream';
import Debug from 'debug';
import {Component} from 'helpers/smv';

export default sources => ({

    debug: Debug('app:root'),

    intent: {},

    component:{
        slider: Component({ sources, path:'components/slider' }),
    },

});
