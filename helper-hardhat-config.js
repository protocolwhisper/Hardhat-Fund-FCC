const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
    // Default one is ETH/USD contract on Kovan
    42: {
        name: "kovan",
        ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
}
const developmentChains = ["hardhat", "localhost"]

const DECIMALS = 8
const INITIAL_ANSWER = 20000000000
const blockConfirmations = 6

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
    blockConfirmations,
}
