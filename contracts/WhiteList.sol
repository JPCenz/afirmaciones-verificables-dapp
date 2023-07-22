// SPDX-License-Identifier: MIT
/// @title A Whitelist used to encrypt personal data.
/// @author  chumpitome@gmail.com; jose.salcedo@utec.edu.pe ; p.cenzano5@gmail.com; giovanniluisbarranteslazo@outlook.com
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
// creating the contract with 0.8.9 version of solidity and importing athe ownable access
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Whitelist is Ownable {

    mapping(address => bool) public whitelist;

    /**
     * @notice Add to whitelist
     */
    function addToWhitelist(address[] calldata toAddAddresses) external onlyOwner
    {
        for (uint i = 0; i < toAddAddresses.length; i++) {
            whitelist[toAddAddresses[i]] = true;
       
        }
    }

    /**
     * @notice Remove from whitelist
     */
    function removeFromWhitelist(address[] calldata toRemoveAddresses) external onlyOwner
    {
        for (uint i = 0; i < toRemoveAddresses.length; i++) {
            delete whitelist[toRemoveAddresses[i]];
        }
    }

    /**
     * @notice Function with whitelist
     */
    function whitelistFunc() public view returns(bool)
    {
        return whitelist[msg.sender];
    }
}
