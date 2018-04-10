const RPCSanityTest = require('./sanity.js');
const colors = require('colors');
const fs = require('fs');


var argv = require('yargs')
    .usage('Usage: $0 [options] endpoints1 ... endpointsn')
    .demandCommand(2)
    .boolean('v')
    .alias('v', 'verbose')
    .describe('v', 'Verbose Output')
    .alias('d', 'directory')
    .nargs('d', 1)
    .demandOption(['d'])
    .describe('d', 'Directory to load tests from')
    .help('h')
    .alias('h', 'help')
    .argv;

function readdir (directory){
    return new Promise ((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) reject(err);
            resolve(files);
        })
    });
}

function readFile (filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) =>{
            if(err) reject(err);
            resolve(data);
        });
    });
}

function buildSuite(directory) {
    let suite = [];
    let files = fs.readdirSync(directory)
    files.forEach((file) => {
        let data = fs.readFileSync(directory+'/'+file)
        suite = suite.concat(JSON.parse(data.toString()).tests);
    });
    return suite;
}

function main() {
    if (!argv.directory) {
        console.error(argv)
        console.error('You must enter a directory')
        process.exit(0)
    }
    console.log(colors.yellow("Testing the following endpoints: "));
    argv._.map((x) => {
        console.log(colors.yellow(x))
    });
    const test = new RPCSanityTest(argv._, { verbose: argv.v });
    const suite = buildSuite(argv.directory);
    suite.forEach((testCase) => {
        test.loadTest(testCase);
    });

    test.executeTests();
}


main();