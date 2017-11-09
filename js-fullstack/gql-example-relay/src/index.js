if (!process.env.NODE_PATH || !process.env.npm_package_name) {
    process.stderr.write('Please start the app using npm');
    process.exit(1);
}

import './server'; // eslint-disable-line import/first
