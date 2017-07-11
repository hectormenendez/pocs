const OS = require('os');
const Cluster = require('cluster');
const Fetch = require('node-fetch');
const API = require('./settings.json');

if (Cluster.isMaster) require('./master');
else if (Cluster.isWorker){
    function fetch(){
        console.log(`${process.pid}::${API.method}`);
        Fetch(API.url, { method:API.method, body:API.body })
            .then(res => res.json())
            .then(json => process.send(json))
            .catch(e => console.error(`${process.pid}::EXCEPTION ${e.message}`));
    }
    // Don't block exection between fetchs
    if (!API.blocking) setInterval(fetch, API.interval);
    // Make an interval that actually blocks execution
    else setTimeout(function a(){
        fetch();
        setTimeout(a, API.interval);;
    }, API.interval);
}
