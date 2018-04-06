// import 'google-apps-script'; // For intellisense on vscode, comment out before pushing

function main() {
    const Document = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = Document.getActiveSheet();

    sheet.getRange('A1').setValue('hola mundo');
}