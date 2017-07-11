const OS = require('os');
const Cluster = require('cluster');

for (let i=0; i < OS.cpus().length; i++) Cluster.fork();

let pids = [];

Cluster.on('online', worker => {
    console.log(`${worker.process.pid}::init`);
    pids.push(worker);
});

Cluster.on('exit', worker => {
    const pid = worker.process.pid;
    pids = pids.filter(w => w.process.pid === pid);
    console.log(`${pid}::end`);
});

Cluster.on('message', (worker, res) => {
    console.log(`${worker.process.pid}::OK`, JSON.stringify(res));
    worker.send(true);
});

process.on('SIGINT', () => {
    process.stdout.write('\n');
    pids.forEach(worker => {
        console.log(`${worker.process.pid}::kill`);
        worker.kill();
    });
    process.exit(0);
});
