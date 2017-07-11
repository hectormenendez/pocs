const OS = require('os');
const Cluster = require('cluster');
const Fetch = require('node-fetch');
const API = require('./settings.json');

if (Cluster.isMaster){
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
    })
    process.on('SIGINT', () => {
        process.stdout.write('\n');
        pids.forEach(worker => {
            console.log(`${worker.process.pid}::kill`);
            worker.kill();
        });
        process.exit(0);
    });
} else if (Cluster.isWorker){
    while(true) {
        console.log(`${process.pid}::${API.method}`);
        Fetch(API.url, { method:API.method, body:API.body })
            .then(res => res.json())
            .then(json => process.send(json));
    }
}
