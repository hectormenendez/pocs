/**
 * @function configsGet
 * @description Retrieve the corresponding range name for a given sheet.
 * @param {!string} name - The name of the sheet.
 * returns {}
 */
function configsGet(name) {
    const config = {};

    /**
     * @typedef {Object} Setting
     * @description A type for the transaction.
     * @property {!string} id - An unique identifier.
     * @property {mixed}  value - The setting value.
     * @property {string} description - A text describing the setting.
     */
    config.Settings = {
        range: 'A:C',
        keys: [
            'id',
            'value',
            'description',
        ],
    };

    /**
     * @typedef {Object} Transaction
     * @description A type for the transaction.
     * @property {!string} id - An unique identifier.
     * @property {!number} date - The date when the transaction was made.
     * @property {!string} from - The id for the account originating the transaction.
     * @property {!string} to - The id for the destination account of the transaction.
     * @property {!string} currency - The id of the currency used for the transaction.
     * @property {!number} amount - The amount of money transactioned.
     * @property {string} description - A text describing the transaction type.
     * @property {!string} type - The id of the type of the transaction.
     * @property {!string} category - The id of the category of the transaction.
     * @property {!string} envelope - The id of the envelope of the transaction.
     */
    config.Transactions = {
        range: 'A:J',
        keys: [
            'id',
            'date',
            'from',
            'to',
            'currency',
            'amount',
            'description',
            'type',
            'category',
            'envelope',
        ],
    };

    /**
     * @typedef {Object} TransactionType
     * @description A type for the transaction.
     * @property {!string} id - An unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {string} description - A text describing the transaction type.
     */
    config.TransactionTypes = {
        range: 'A:C',
        keys: [
            'id',
            'name',
            'description',
        ],
    };

    /**
     * @typedef {Object} TransactionCategory
     * @description A category for the transaction.
     * @property {!string} id - An unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {!number} balance - The amount of money this envelope has.
     * @property {string} description - A text describing the transaction category.
     */
    config.TransactionCategories = {
        range: 'A:D',
        keys: [
            'id',
            'name',
            'balance',
            'description',
        ],
    };

    /**
     * @typedef {Object} TransactionEnvelope
     * @description A spending budget cetegory for the transaction.
     * @property {!string} id - An unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {!number} balance - The amount of money this envelope has.
     * @property {string} description - A text describing the transaction type.
     */
    config.TransactionEnvelopes = {
        range: 'A:D',
        keys: [
            'id',
            'name',
            'balance',
            'description',
        ],
    };

    /**
     * @typedef {Object} AccountType
     * @description A way to identify the type of transactions/rules and account will have.
     * @property {!string} id - An unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {string} description - A text describing the account type.
     */
    config.AccountTypes = {
        range: 'A:C',
        keys: [
            'id',
            'name',
            'description',
        ],
    };

    /**
     * @typedef {Object} Account
     * @description A virtual holder of a balance.
     * @property {!string} id - A unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {!string} owner - An account owner identifier.
     * @property {!string} type - An account type identifier.
     * @property {!number} dateCreated - The date when the account was created.
     * @property {!boolean} enabled - Whether the account is enabled or not.
     * @property {!number} balance - The amount this account holds.
     * @property {!string} currency - The currency ID for the account balance.
     * @property {!number} balanceInit - The initial balance when created.
     * @property {string} description - A text describing the account.
     */
    config.Accounts = {
        range: 'A:J',
        keys: [
            'id',
            'name',
            'owner',
            'type',
            'dateCreated',
            'enabled',
            'balance',
            'currency',
            'balanceInit',
            'description',
        ],
    };

    /**
     * @typedef {Object} Currency
     * @description A representation for money value in a contry.
     * @property {!string} id - An unique identifier.
     * @property {!string} name - A human readable identifier.
     * @property {!number} value - The value for the currency (relative to default one)
     */
    config.Currencies = {
        range: 'A:C',
        keys: [
            'id',
            'name',
            'value',
        ],
    };

    /**
     * @typedef {Object} Owner
     * @description An individual or an entity that controls accounts.
     * @property {!string} id - A unique identifier. (descriptive for the spreadsheet)
     * @property {!string} name - A human readable identifier.
     * @property {!number} dateCreated - The creation date of this account. [UTC]
     * @property {!number} balance - The net worth of this account.
     * @property {string} description - a text description for the owner.
     */
    config.Owners = {
        range: 'A:E',
        keys: [
            'id',
            'name',
            'dateCreated',
            'balance',
            'description',
        ],
    };

    return config[name];
}
