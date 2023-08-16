/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function transactioncategoriesGet
 * @description Returns the AccountTypes dataset.
 * @returns {TransactionCategory[]} The collection of available account types.
 */
function transactioncategoriesGet() {
    const config = configsGet('TransactionCategories');
    const values = utilsGetSheet('TransactionCategories')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}

