const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const _ = require('lodash')
const colors = require('colors');

class RPCSanityTest{
    
    constructor (endpoints, options){
        this.endpoints = endpoints;
        this.options = options;
        this.listOfProviders = endpoints.map((endpoint) =>{
            return new EthRPC(new HttpProvider(endpoint));
        })
        this.listOfTests = [];
    }
    
    //returns a list of promises
    naryQuery (listOfProviders, options) {
        let promises = listOfProviders.map((rpc) => {
            return rpc.sendAsync(options);
        });
        return promises;
    }
    
    isEqual (a, b){
        return _.isEqual(a, b);
    }

    loadTest(options) {
        this.listOfTests.push(options);
    }

    async executeTests(){
        console.log();
        console.log('STARTING TO EXECUTE TESTS')
        for (let i = 0 ; i < this.listOfTests.length ; i++){
            console.log(colors.rainbow('Starting Test ' + i + ": " + this.listOfTests[i].method));
            await this.testMethod(this.listOfTests[i]);
        }
    }

    async testMethod (options) {
        let results = this.naryQuery(this.listOfProviders, options);
        for (let i = 0 ; i < results.length ; i++) {
            try{
                results[i] = await results[i];
            } catch (error){
                console.log(colors.red('Error at endpoint: ' + this.endpoints[i] + ' with error message: '));
                console.log(error);
                console.log(colors.red('Test Case Failed'));
                return;
            }
        }

        let match  = this.isEqual(results[0], results[3]);
        if (match){
            console.log(colors.green('Test Case Pass'));
            if (this.options.verbose) {
                for ( let i = 0 ; i < results.length ; i ++){
                    console.log(this.endpoints[i] + ": " + results[i]);
                }
            }
        } else {
            console.log(colors.red('Test Case Failed'));
            for ( let i = 0 ; i < results.length ; i ++){
                console.log(this.endpoints[i], ": ", results[i]);
            }
        }
    }
}

module.exports = RPCSanityTest