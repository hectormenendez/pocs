// Node modules
import PATH from 'path';
// NPM modules
import Nodemon from 'nodemon';

// Local modules
import Path from 'tools/path';

const commands = [];
// Parses the backend source using eslint
commands.push([
    PATH.join(Path.modules, '.bin', 'eslint'),
    PATH.join(Path.back, '**', '*.js'),
].join(' '));

// Runs the backend source trough babel-node
commands.push([
    'DEBUG=feathers*,socket.io*,app:*',
    `NODE_PATH=${Path.back}:${Path.source}`,
    PATH.join(Path.modules, '.bin', 'babel-node'),
    Path.back,
].join(' '));

Nodemon({
    restartable: 'rs',
    ext: 'js json',
    verbose: true,
    watch: Path.back,
    exec: commands.join('&&'),

})
    .on('restart', () => process.stdout.write('\n\n RESTART \n\n'))
    .on('quit', function(){
        console.log('quit');
        process.exit(0);
    });
