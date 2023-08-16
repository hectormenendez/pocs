/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function ownersGet
 * @description Returns the owners dataset.
 * @returns {Owner[]} The collection of available owners.
 */
function ownersGet() { // eslint-disable-line no-unused-vars
    const config = configsGet('Owners');
    const values = utilsGetSheet('Owners')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}

