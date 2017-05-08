import $ from 'xstream';

const type = {
    stream: $.create().constructor,
    memory: $.createWithMemory().constructor,
};

export default function isStream(subject){
    if (!subject || !subject.constructor) return false;
    const target = subject.constructor;
    if (target !== type.stream && target !== type.memory) return false;
    return true;
}
