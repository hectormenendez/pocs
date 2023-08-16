/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function accounttypesGet
 * @description Returns the AccountTypes dataset.
 * @returns {AccountType[]} The collection of available account types.
 */
function accounttypesGet() { // eslint-disable-line no-unused-vars
    const config = configsGet('AccountTypes');
    const values = utilsGetSheet('AccountTypes')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}

