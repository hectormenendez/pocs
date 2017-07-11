const Cluster = require('cluster');
const Fetch = require('node-fetch');
const API = require('./settings.json');

if (Cluster.isMaster) require('./master');
else if (Cluster.isWorker){
    function fetch(){
        console.log(`${process.pid}::${API.method}`)
        Fetch(API.url, { method:API.method, body:API.body })
            .then(res => res.json())
            .then(json => process.send(json));
    }
    fetch();
    process.on('message', () => fetch());
}
