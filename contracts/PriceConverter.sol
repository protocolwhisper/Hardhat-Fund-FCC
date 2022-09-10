//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        //ABI
        //Address of the contract 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        (, int256 price, , , ) = priceFeed.latestRoundData();

        //Eth in terms of usd
        //The result will have 8 decimals so since we want to all be in the same notation we will use
        return uint256(price * 1**10);
    }

    function getDecimals() public view returns (uint8) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );

        return priceFeed.decimals();
    }

    function getVersion() public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e
        );
        return priceFeed.version();
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface i_priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(i_priceFeed);
        uint256 ethAmountinUsd = (ethPrice * ethAmount) / 1**18;
        return ethAmountinUsd;
    }
}
