/* globals utilsGetSheet, utilsValuesToObject, configsGet */

/**
 * @function transactionenvelopesGet
 * @description Returns the AccountTypes dataset.
 * @returns {TransactionEnvelope[]} The collection of available account types.
 */
function transactionenvelopesGet() {
    const config = configsGet('TransactionEnvelopes');
    const values = utilsGetSheet('TransactionEnvelopes')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values);
}

