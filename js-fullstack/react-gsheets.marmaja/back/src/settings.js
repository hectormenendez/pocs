/* globals utilsGetSheet, configsGet, utilsValuesToObject */

/**
 * @function settingsGet
 * @description Returns given setting name's value
 * @returns {Setting} - The settings array.
 */
function settingsGet() {
    const config = configsGet('Settings');
    const values = utilsGetSheet('Settings')
        .getRange(config.range)
        .getValues();
    return utilsValuesToObject(config.keys, values)
        .reduce(function reducer(acc, setting) {
            acc[setting.id] = setting.value;
            return acc;
        }, {});
}
