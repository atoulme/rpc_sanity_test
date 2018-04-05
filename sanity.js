const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const _ = require('lodash')
const colors = require('colors');

class RPCSanityTest{
    
    constructor (urlOld, urlNew){
        this.ethOld = new EthRPC(new HttpProvider(urlOld));
        this.ethNew = new EthRPC(new HttpProvider(urlNew));
        this.listOfTests = [];
    }
    
    doubleQuery (options) {
        return new Promise(async (resolve, reject) => {
            let oldResult = await this.ethOld.sendAsync(options);
            let newResult = await this.ethNew.sendAsync(options);
            resolve({oldResult: oldResult, newResult: newResult});
        })
    }
    
    isEqual (a, b){
        return _.isEqual(a, b);
    }

    loadTest(options) {
        this.listOfTests.push(options);
    }

    async executeTests(){
        console.log('STARTING TO EXECUTE TESTS')
        for (let i = 0 ; i < this.listOfTests.length ; i++){
            console.log(colors.rainbow('Starting Test ' + i + ": " + this.listOfTests[i].method));
            await this.testMethod(this.listOfTests[i]);
        }
    }

    async testMethod (options) {
        let result = await this.doubleQuery(options);
        let match  = this.isEqual(result.oldResult, result.newResult);
        if (match){
            console.log(colors.green('Test Case Pass'));
        } else {
            console.log(colors.red('Test Case Failed'));
        }
    }
}

module.exports = RPCSanityTest