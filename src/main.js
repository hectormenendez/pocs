
// import 'google-apps-script'; // For intellisense on vscode, comment out before pushing

function doGet() {
    return HtmlService.createHtmlOutputFromFile('listCourses');
}

function listCourses() {
    return  'SUCCESS';
}
