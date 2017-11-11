/* eslint-disable global-require */

if (!process.env.NODE_PATH || !process.env.npm_package_name) {
    process.stderr.write('Please start the app using npm');
    process.exit(1);
}

const args = process.argv.slice(2);
if (!args.length) {
    process.stderr.write([
        '',
        'Please specify the mode you wish to use:',
        'server: Initialize the server.',
        'schema: Generate the schema from file.',
        '', '',
    ].join('\n'));
    process.exit(1);
}

switch (args.shift()) {
    case 'server':
        require('tools/server');
        break;
    case 'schema':
        require('tools/schemaUpdate');
        break;
    default:
        process.exit(1);
}
