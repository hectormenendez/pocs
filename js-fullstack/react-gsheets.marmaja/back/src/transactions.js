/* globals utilsValuesToObject, utilsGetSheet, configsGet, Utilities, SpreadsheetApp */

/**
 * @function transactionsGet
 * @description Returns the transactions dataset.
 * @returns {Transaction[]} The collection of available accounts.
 */
function transactionsGet() {
    const configs = configsGet('Transactions');
    const values = utilsGetSheet('Transactions')
        .getRange(configs.range)
        .getValues();
    return utilsValuesToObject(configs.keys, values);
}

/**
 * @function transactionPost
 * @description Creates new transactions.
 * @param {Transaction[]} transactions - An array of transaction objects.
 * @returns {bool} - Whether the transaction succeded or not.
 */
function transactionsPost(transactions) {
    const configs = configsGet('Transactions');
    const sheet = utilsGetSheet('Transactions');
    // const transactions = [{
    //     amount: 222,
    //     category: 'service',
    //     currency: 'MXN',
    //     envelope: 'entertainment',
    //     from: 'mx.bank.bbva.auto',
    //     to: 'mx.bank.bbva.nomina',
    //     date: 1525143960000,
    //     description: 'aaaa',
    //     type: 'transfer',
    // }];
    const rows = transactions.map(function transactionMapper(transaction) {
        const row = [Utilities.getUuid()];
        configs.keys
            .slice(1) // Skip the id
            .forEach(function keyIterator(key) {
                const value = key === 'date'
                    ? new Date(transaction[key])
                    : transaction[key];
                row.push(value);
            });
        sheet.appendRow(row);
        return row;
    });
    // Logger.log(rows);
    return rows.length;
}
