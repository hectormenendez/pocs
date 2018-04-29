/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function transactiontypesGet
 * @description Returns the AccountTypes dataset.
 * @returns {TransactionType[]} The collection of available account types.
 */
function transactiontypesGet() {
    const config = configsGet('TransactionTypes');
    const values = utilsGetSheet('TransactionTypes')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}

