/* globals utilsValuesToObject, utilsGetSheet, configsGet */

/**
 * @function accountsGet
 * @description Returns the Accounts dataset.
 * @returns {Account[]} The collection of available accounts.
 */
function accountsGet() {
    const configs = configsGet('Accounts');
    const values = utilsGetSheet('Accounts')
        .getRange(configs.range)
        .getValues();
    return utilsValuesToObject(configs.keys, values);
}
