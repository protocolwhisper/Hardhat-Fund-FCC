// import
//main function
//calling of main functions

// async function deployFunc() {
//     console.log("Hi")
// }

// module.exports.default = deployFunc()

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
const { Provider } = require("@ethersproject/providers")
const { providers } = require("ethers")
const { hre } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments // What the f is depoyed
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //console.log(chainId) //Debug purpose
    //What happen if we want to change chains
    //When going for localhost or hardhat network we want to use a mock

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] //Maybe in this way it querys how it works
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
        //console.log(ethUsdPriceFeedAddress)
    }
    // If the contract doesn't exist we deploy a minimal version in our local testing
    const args = [ethUsdPriceFeedAddress]
    const fundme = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: args, // Put pricefedd
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        // Here we will verify the contract
        await verify(fundme.address, args) // This takes contract address and arguments of the constructor
    }
    log("------------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
