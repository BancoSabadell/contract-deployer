'use strict';

const fs = require('fs');
const Web3 = require('web3');
const TestRPC = require('ethereumjs-testrpc');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

const Deployer = require('../src/index.js');

const provider = TestRPC.provider({
    accounts: [{
        index: 0,
        secretKey: '0x998c22e6ab1959d6ac7777f12d583cc27d6fb442c51770125ab9246cb549db80',
        balance: 200000000
    }]
});

const web3 = new Web3(provider);

describe('Deployer', function () {

    const account1 = '0x5bd47e61fbbf9c8b70372b6f14b068fddbd834ac';
    const testContracts = {
        'Foo.sol': fs.readFileSync('./test/contracts/Foo.sol', 'utf8'),
        'Bar.sol': fs.readFileSync('./test/contracts/Bar.sol', 'utf8')
    };

    it('should deploy contracts correctly', function () {
        const deployer = new Deployer(web3, {sources: testContracts}, 0);
        return deployer.deploy('Foo', [], { from: account1 });
    }).timeout(4000);

    it('should fail if contract name is not valid', function () {
        const deployer = new Deployer(web3, {sources: testContracts}, 0);
        return deployer.deploy('Faa', [], { from: account1 }).should.be.rejected;
    });

    it('should fail if contract code not valid', function () {
        const deployer = new Deployer(web3, 'pragma solidity ^0.4.8;\ncontracts A {}', 0);
        return deployer.deploy('A', [], { from: account1 }).should.be.rejected;
    });

    it('should promisify contract methods', function () {
        const deployer = new Deployer(web3, {sources: testContracts}, 0);
        return deployer.deploy('Foo', [], { from: account1 })
            .then(foo => foo.fooAsync({ from: account1, gas: 400000 }));
    });

});