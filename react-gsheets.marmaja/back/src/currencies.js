/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function currenciesGet
 * @description Returns the AccountTypes dataset.
 * @returns {Currency[]} The collection of available account types.
 */
function currenciesGet() { // eslint-disable-line no-unused-vars
    const config = configsGet('Currencies');
    const values = utilsGetSheet('Currencies')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}
