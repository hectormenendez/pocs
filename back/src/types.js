/* globals utilGetSheet, utilValuesToObject */

/**
 * @function typesGet
 * @description Obtain the "types" sheet.
 * @returns {Array} key value objects for the identifier and description.
 */
function typesGet() { // eslint-disable-line no-unused-vars
    return utilGetSheet('Types')
        .getRange('A:B')
        .getValues()
        .reduce(function reducer(acc, values) {
            acc.push({ key: values[1], value: values[0] });
            return acc;
        }, []);
}

