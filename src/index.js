'use strict';

const solc = require('solc');
const Promise = require('bluebird');

class Deployer {

    constructor(web3, source, enableOptimizer) {
        this.web3 = web3;
        this.source = source;
        this.enableOptimizer = enableOptimizer;
    }

    deploy(contractName, contractConstructorArguments, txOptions) {
        return new Promise((resolve, reject) => {

            if (!this.compilation) {
                const compilation = solc.compile(this.source, this.enableOptimizer);

                if (compilation.errors && compilation.errors.length) {
                    reject(new Error(compilation.errors[0]));
                } else {
                    this.compilation = compilation;
                }
            }

            if (!this.compilation.contracts[contractName]) {
                const availableContracts = Object.getOwnPropertyNames(this.compilation.contracts);
                reject(new Error(`Invalid contract name '${contractName}', available contracts: ${availableContracts}`));
            }

            const contractFactory = this.compilation.contracts[contractName];
            const contract = this.web3.eth.contract(JSON.parse(contractFactory.interface));
            const contractData = contract.new.getData(...contractConstructorArguments, { data: contractFactory.bytecode });

            this.web3.eth.estimateGas({ data: contractData }, (error, estimatedGas) => {
                contract.new(...contractConstructorArguments,
                    Object.assign({ data: contractFactory.bytecode, gas: estimatedGas }, txOptions),
                    (error, deployedContract) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (deployedContract.address) {
                                resolve(Promise.promisifyAll(deployedContract));
                            }
                        }
                    });
            });

        });
    };

}

module.exports = Deployer;