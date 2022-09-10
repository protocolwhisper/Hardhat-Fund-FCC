const { LogDescription } = require("@ethersproject/abi")
const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    //What happen if we want to change chains
    //When going for localhost or hardhat network we want to use a mock

    if (developmentChains.includes(network.name)) {
        log("Local Network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true, //Info abou deployment
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("Mocks Deployed")
        log("---------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
