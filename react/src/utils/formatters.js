export default {
    currency: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
};
