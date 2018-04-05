# rpc-sanity-test

This program allows for detecting diffs between two different Ethereum RPC sources. 



To run this, the repo should first be cloned. Enter into the directory and run the following commands:

```
npm install
npm start
```

This will install all the dependancies and will run the tests. 

To add more test cases, edit the `start` routine in `index.js`. 

For example to add another test case to test `eth_getLogs`, add `    test.loadTest({method: 'eth_getLogs', params: [{from: 1700000, to: 1700005}]});`. This will add that test to the queue.