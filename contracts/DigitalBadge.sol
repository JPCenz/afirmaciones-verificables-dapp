// SPDX-License-Identifier: MIT

/// @title A Digital Badge for Smart Contracts.
/// @author  chumpitome@gmail.com; jose.salcedo@utec.edu.pe ; p.cenzano5@gmail.com; giovanniluisbarranteslazo@outlook.com
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.

//setting the solidity version and importing the openzeppelin contracts
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; 

//declaring the contract functions and setting and upgrading the ROLES.
contract DigitalBadge is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    //setting the IERC20 to USDC Token
    IERC20 usdcToken ;

    struct MetadataToken {
        bool isTransferable; // boolean transferable for the metadata token
        uint256 amountUSDC; // the amount of USDC in UINT256 for the metadata token
    }
    //creating a mapping to the metadata token
    mapping(uint256 => MetadataToken) metadataToken;
    
    // initializng string variables typeof memory
    function initialize(
        string memory _name,
        string memory _symbol
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
    // declaring every role to be message senders
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }


    // creating the burn function for the verifier role.
    // creating a badge for the metadata token with the address and veryfing if has balance.
    function burn(uint256 tokenId)  external onlyRole(VERIFIER_ROLE) {
        uint256 _valueBadge = metadataToken[tokenId].amountUSDC;
        address owner = ERC721Upgradeable.ownerOf(tokenId);
        require( usdcToken.allowance(msg.sender, address(this)) >= _valueBadge,"DB: Not enough allow");
        require( usdcToken.balanceOf(msg.sender) >= _valueBadge,"DB: Not enough balance");
    // the token burned will disappear.
        usdcToken.transferFrom(msg.sender, owner, _valueBadge);
        _burn(tokenId);
    }

    // the safemin function to transfer tokens with minter role
    function safeMint(
        address to,
        string memory uri,
        bool _isTransferable,
        uint256 amountValue
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        setMetadataToken(tokenId,_isTransferable,amountValue);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }



    // this will show if the insignia has a value that can be returned!
    function valueOfInsignia(uint256 _tokenId)  public view returns (uint256) {
        require(ownerOf(_tokenId) != address(0),"DB Token no existe");
        return metadataToken[_tokenId].amountUSDC;
    }


    // the set token address function 
    
    
    function setTokenAddress(
        address _tknAdress
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        usdcToken = IERC20(_tknAdress);
    }
    // this function will return the token address and show in the front
    function getTokenAddress() external view returns(address){
        return address(usdcToken);
    }

    //setting if metadatatoken is fransferable depending of the amount
    function setMetadataToken(uint256 _tokenId, bool _isTransferable, uint256 _amountValue) internal {
        MetadataToken storage metadataTkn = metadataToken[_tokenId];
        metadataTkn.isTransferable = _isTransferable;
        metadataTkn.amountUSDC = _amountValue;
    }


    // a child function to authorize upgrade when the role is upgrader!
    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyRole(UPGRADER_ROLE) {}

    // overrides by Solidity.
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

// Depends on the id to use this function to burn tokens!
    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }
    // returns a string
    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    // this function will help with the transfer of tokens by the owner.js
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(ERC721Upgradeable, IERC721Upgradeable) {
        MetadataToken storage metadataTkn = metadataToken[tokenId];
        require(
            metadataTkn.isTransferable,
            "Di Ba: Tkn No se puede transferir"
        );
        return super.safeTransferFrom(from, to, tokenId);
    }
        // setting the parameters 
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721Upgradeable, IERC721Upgradeable) {
        safeTransferFrom(from, to, tokenId, data);
    }
    // returns an interfaceId
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(
            ERC721Upgradeable,
            ERC721EnumerableUpgradeable,
            ERC721URIStorageUpgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
