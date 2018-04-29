/* eslint-disable no-undef */

function get(name) {
    switch (name) {
        case 'state': return {
            owners: {
                list: ownersGet(),
            },
            accounts: {
                list: accountsGet(),
                types: accounttypesGet(),
            },
            currencies: {
                list: currenciesGet(),
            },
            transactions: {
                envelopes: transactionenvelopesGet(),
                categories: transactioncategoriesGet(),
                types: transactiontypesGet(),
            },
        };

        default: return null;
    }
}

/* eslint-enable no-undef */
