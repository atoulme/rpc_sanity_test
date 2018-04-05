const RPCSanityTest = require('./sanity.js')
const test = new RPCSanityTest('https://ropsten.infura.io', 'https://ropsten.infura.io');

async function start(){
    test.loadTest({method: 'eth_getLogs', params: [{from: 1700000, to: 1700005}]});
    test.loadTest({method: 'eth_getBalance', params:["0x07cff6218249a2351a174bdc1e5b1632e8e4e673", 'latest']});
    test.loadTest({method: 'eth_getTransactionCount', params:["0x07cff6218249a2351a174bdc1e5b1632e8e4e673", 'latest']});

    test.executeTests ()
}

start()