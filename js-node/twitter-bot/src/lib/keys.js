'use strict';

const KEYS = new WeakMap();

const rxUSER = '[^\\S]*(%W%)[^\\S]*';
const rxTEXT = `\\b#?${rxUSER}\\b`;

const onReduce = (a, b)=> (a.name? [a.name.trim()] : a).concat([b.name.trim()]);
const onFilter = function(arr, type){
	arr = arr.filter(o => o.type === type);
	if (arr.length) arr = arr.reduce(onReduce);
	return arr;
};

module.exports = class {

	constructor(keys){
		KEYS.set(this, keys);
		this.allowed = onFilter(keys, 'allow');
		this.denied  = onFilter(keys, 'deny');
	}

};