import FeathersHooks from 'feathers-hooks';
import { QueryRegex } from './query';
import { DateSort, DateAssign, DateFormat } from './date';

export const before = {
    all: [],
    find: [QueryRegex(), DateSort()],
    get: [],
    update: [],
    create: [DateAssign()],
    patch: [],
    remove: [],
}

export const after = {
    all: [],
    find: [DateFormat('find')],
    get: [],
    update: [],
    create: [DateFormat('create')],
    patch: [],
    remove: [],
}

export default { before, after };
