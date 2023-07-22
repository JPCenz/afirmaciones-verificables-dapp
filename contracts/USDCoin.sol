// SPDX-License-Identifier: MIT
/// @title This contract is used for USDCoins MINTER ROLE.
/// @author  chumpitome@gmail.com; jose.salcedo@utec.edu.pe ; p.cenzano5@gmail.com; giovanniluisbarranteslazo@outlook.com
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
// creating the contract with 0.8.9 version of solidity and importing and token and the accesscontrol
pragma solidity 0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// The contract is used for USDCoins MINTER ROLE
contract USDCoin is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
// the constructor will mint usd coin and multiply per 10 and square to decimals
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

// how much tokens will send  as a minter role?
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
// returns 6
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}