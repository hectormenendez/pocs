function getTypes() {

    return SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName('Types')
        .getRange('A:B')
        .getValues()
        .reduce(function reducer(acc, values) {
            acc.push({ key: values[1], value: values[0] });
            return acc;
        }, []);
}
