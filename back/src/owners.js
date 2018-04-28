/* globals utilGetSheet, utilValuesToObject */

/**
 * @typedef {Object} Owner
 * @description An individual or an entity that controls accounts.
 *
 * @property {String} id - A unique identifier. (descriptive for the spreadsheet)
 * @property {String} name - A human readable identifier.
 * @property {String} date - The creation date of this account. [serialized new Date()]
 * @property {Number} balance - The net worth of this account.

/**
 * Returns the owners dataset.
 *
 * @returns {Owner[]} The collection of available owners.
 */
function ownersGet() { // eslint-disable-line no-unused-vars
    const map = ['id', 'name', 'date', 'balance'];
    const owners = utilGetSheet('Owners')
        .getRange('A:D')
        .getValues();
    return utilValuesToObject(owners);
}

