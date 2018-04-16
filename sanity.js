const HttpProvider = require('ethjs-provider-http');
const EthRPC = require('ethjs-rpc');
const _ = require('lodash')
const colors = require('colors');
const fs = require('fs');

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
            console.log(colors.rainbow('Starting Test ' + i + ": " + this.listOfTests[i].payload.method));
            await this.testMethod(this.listOfTests[i]);
        }
    }

    async testMethod (options) {
        let results = this.naryQuery(this.listOfProviders, options.payload);
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
        for(let i = 1 ; i < results.length ; i++){
            let match = this.isEqual(results[0], results[i]);
            if(!match){
                console.log(colors.red('Test Case Failed'));
                for ( let j = 0 ; j < results.length ; j ++){
                    console.log(this.endpoints[j], ": ", JSON.stringify(results[j]));
                }
                return;
            }
        }
        if (options.result){
            console.log("Comp")
            if(!this.isEqual(options.result, results[0])){
                console.log("FUCK")
                console.log(typeof(options.result))
                console.log(typeof(results[0]))
                fs.writeFileSync("1.json", JSON.stringify(options.result))
                fs.writeFileSync("2.json", JSON.stringify(results[0]))
            }
        }
        console.log(colors.green('Test Case Pass'));
        if (this.options.verbose) {
            for ( let i = 0 ; i < results.length ; i ++){
                console.log(this.endpoints[i] + ": " + JSON.stringify(results[i]));
            }
        }

    }
}

module.exports = RPCSanityTest