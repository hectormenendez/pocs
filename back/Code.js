function myFunction(value) {
  Logger.log('this is a log: ' + value);
  if (!value) value = "Hello World";
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  sheet.getRange("A1").setValue(value);
}
