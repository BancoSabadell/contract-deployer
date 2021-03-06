# contract-deployer [![CircleCI](https://circleci.com/gh/BancoSabadell/contract-deployer.svg?style=shield)](https://circleci.com/gh/BancoSabadell/contract-deployer) [![npm version](https://img.shields.io/npm/v/contract-deployer.svg?style=flat)](https://www.npmjs.com/package/contract-deployer) 

Code is worth a thousand words, so lets see an example code of the tipical contract deployment and how contract-deployer can help you reduce boilerplate code:

```javascript
const fs = require('fs');
const solc = require('solc');
    
const web3 = // ...

const source = fs.readFileSync('Hello.sol', 'utf8');
const compiledContract = solc.compile(source, 1);
const abi = compiledContract.contracts['Hello'].interface;
const bytecode = compiledContract.contracts['Hello'].bytecode;
const gasEstimate = web3.eth.estimateGas({ data: bytecode });

const contractFactory = web3.eth.contract(JSON.parse(abi));

const myContract = contractFactory.new(param1, param2, {
    from: sender,
    data: bytecode,
    gas: gasEstimate
}, function (error, myContract) {
    if (error) {
        // report error
    } else {
        // check address (contract deployed)
        if (myContract.address) {
            // start using contract
        }
    }
});
```

With _contract-deployer&trade;_ it becomes:

```javascript
const Deployer = require('contract-deployer');

const deployer = new Deployer(web3, {sources: fs.readFileSync('Hello.sol', 'utf8')}, 0);
deployer.deploy('Hello', [param1, param2], { from: sender })
  .then(hello => { /* start using contract */ })
  .catch(error => { /* report error */ });
```

As you can see, `deploy()` returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), so you can chain multiple deploys using [`Promise.then(...)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then):

```javascript
const sources = {
    'A.sol': 'contract A {}',
    'B.sol': 'contract B { function B(A a) { ... } }'
};

const deployer = new Deployer(web3, {sources}, 0);
deployer.deploy('A', [])
    .then(a => deployer.deploy('B', [a]))
    .then(b => /* start using b */);
```

## contract-deployer caches the source code compilation:

    // TODO

## contract-deployer "promisifies" deployed contract methods:

    // TODO

## Installation

    npm install contract-deployer

## API

### Create a new Deployer instance:

```javascript
const deployer = new Deployer(web3, sources, enableOptimizer);
```

#### Parameters:

* `web3`: a [web3](https://github.com/ethereum/web3.js) instance
* `sources`: an string containing valid Solidity code or for multiple source files an object with the format `{ sources: {'contractA.sol': '...', 'contractB.sol': '...'} }`
* `enableOptimizer`: whether or not the solc optimizer is enable

#### Returns:

A new Deployer instance.

### Deploy a smart contract from a Solidity source file or a string containing the code:

```javascript
const promise = deployer.deploy(contractName, constructorArgs, txOptions);
```

#### Parameters:

* `contractName`: contract name of contract to deploy (should match contract name defined in the Solidity declaration: `contract ContractName {}`)
* `constructorArgs`: an arrays containing the arguments for the contract constructor
* `txOptions`: [options](https://github.com/ethereum/wiki/wiki/JavaScript-API#parameters-24) for the underlying contract creation transaction
    
#### Returns:

A JavaScript Promise that will resolve as soon as the contract is mined or reject if errors are found.
