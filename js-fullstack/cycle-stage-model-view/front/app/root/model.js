import $ from 'xstream';
import Debug from 'debug';

export default function Model({ intent }){

    const debug = Debug('app:model');

    // The default state
    const state = {
        subject: 'World'
    };

    return { State: $.of(state) };
}
