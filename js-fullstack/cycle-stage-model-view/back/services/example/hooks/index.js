import FeathersHooks from 'feathers-hooks';
import {HookExample} from '../../../hooks';
import Loader from '../../../loader';

const {HookLocalExample} = Loader(__dirname)
    .reduce((hooks, hook) => ({ ...hooks, [hook.name]: hook }), {})

export const before = {
    all: [HookExample()],
    find: [],
    get: [],
    update: [],
    create: [],
    patch: [],
    remove: [],
}

export const after = {
    all: [HookLocalExample],
    find: [],
    get: [],
    update: [],
    create: [],
    patch: [],
    remove: [],
}

export default { before, after };
