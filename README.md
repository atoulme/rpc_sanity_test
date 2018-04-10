# rpc-sanity-test

This program allows for detecting diffs between two different Ethereum RPC endpoints. 



To run this, the repo should first be cloned. Enter into the directory and run the following commands:

```
npm install
```

This will install all the dependancies. 

## Creating tests

Make a new folder and a new file within it. The structure of the testfile should look a little something like:

```json
{
    "tests": [
        {...},
        {...},
        {...},
    ]
}
```

`{…}` is where the post body goes. There are examples in the `tests` folder. 

## Pointing to Different RPC Endpoints

To compare between n number of endpoints, run `node index.js https://endpoint1.blah https://endpoint2.blah ... https://endpointn.blah -d <test directory>`