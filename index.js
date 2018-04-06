const RPCSanityTest = require('./sanity.js')
const test = new RPCSanityTest('https://mainnet.infura.io', 'http://10.0.20.231:8545');

async function start(){
    test.loadTest({method: 'eth_getLogs', params: [{from: 1700000, to: 1700005}]});
    test.loadTest({method: 'eth_getBalance', params:["0x07cff6218249a2351a174bdc1e5b1632e8e4e673", 'latest']});
    test.loadTest({method: 'eth_getTransactionCount', params:["0x07cff6218249a2351a174bdc1e5b1632e8e4e673", 'latest']});
    test.loadTest({method:"eth_estimateGas", params:[{to: "0x90C892a89daf937dD4c150120469c4EB146F164c", data: "0x60d586f8"}]});
    test.executeTests();
}

start();