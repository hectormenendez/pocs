export default {
    currency: value => value.replace(/\$\s?|(,*)/g, ''),
};
