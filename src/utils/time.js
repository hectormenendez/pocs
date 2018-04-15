
export const MilliToHuman = time => [
    Math.floor(time / 60000).toString().padStart(2, '0'),
    ((time % 60000) / 1000).toString().padStart(2, '0'),
].join(':');


export default {
    milliToHuman: MilliToHuman,
};
