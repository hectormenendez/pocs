/* globals Logger, SpreadsheetApp */

/**
 * @typedef {Object} Range
 * @description Access and modify spreadsheet ranges.
 * It be a single cell in a sheet or a group of adjacent cells in a sheet.
 */

/**
 * @method Range.getValues
 * @description Returns the rectangular grid of values for this range.
 * @returns {Object[][]}
 */

/**
 * @typedef {Object}  Sheet
 * @description Object that allows the manipulation of a sheet in a spreadSheet.
 *
 */

/**
 * @method Sheet.getRange
 * @description Returns the range as specified in A1 notation or R1C1 notation.
 * @param {!string} a1Notation - A string as specified in A1 notation or R1C1 notation.
 * @returns {Range} the range at the designated location.
 */

/**
 * @function utilGetSheet
 * @description Shorthand to obtain a Sheet by name.
 * @param {!string} name - The name of the sheet to retrieve,
 * @returns {Sheet} The specified sheet.
 */
function utilGetSheet(name) {
    if (typeof name !== 'string' || !name.length) throw new Error('[getSheet] name');
    return SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(name);
}

/**
 * @function utilGetSheet
 * @description Convert a values matrix into a JSON-compliant object.
 * @param {!Array} keys - The property names to be used as headers of given values.
 * @param {!Object[][]} values - Values obtained from a getRange() method.
 * @returns {Object} - A key-value representation.
 */
function utilValuesToObject(keys, values) {
    return values.reduce(function reducerRows(rows, cols) {
        const row = Object
            .keys(cols)
            .reduce(function reducerCols(obj, key, i) {
                obj[keys[i]] = cols[key] instanceof Date
                    ? cols[key].getTime()
                    : cols[key];
                return obj;
            }, {});
        // Logger.log(row);
        return rows.concat(row);
    }, []);
}
