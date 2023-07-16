// SPDX-License-Identifier: MIT

/// @title A Digital Badge for Smart Contracts.
/// @author  JPCenz
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.


pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    IERC20 usdcToken ;

    struct MetadataToken {
        bool isTransferable;
        uint256 amountUSDC;
    }
    mapping(uint256 => MetadataToken) metadataToken;
    

    function initialize(
        string memory _name,
        string memory _symbol
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }



    function burn(uint256 tokenId)  external onlyRole(VERIFIER_ROLE) {
        uint256 _valueBadge = metadataToken[tokenId].amountUSDC;
        address owner = ERC721Upgradeable.ownerOf(tokenId);
        require( usdcToken.allowance(msg.sender, address(this)) >= _valueBadge,"DB: Not enough allow");
        require( usdcToken.balanceOf(msg.sender) >= _valueBadge,"DB: Not enough balance");
        
        usdcToken.transferFrom(msg.sender, owner, _valueBadge);
        _burn(tokenId);
    }


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




    function valueOfInsignia(uint256 _tokenId)  public view returns (uint256) {
        require(ownerOf(_tokenId) != address(0),"DB Token no existe");
        return metadataToken[_tokenId].amountUSDC;
    }



    function setTokenAddress(
        address _tknAdress
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        usdcToken = IERC20(_tknAdress);
    }

    function getTokenAddress() external view returns(address){
        return address(usdcToken);
    }


    function setMetadataToken(uint256 _tokenId, bool _isTransferable, uint256 _amountValue) internal {
        MetadataToken storage metadataTkn = metadataToken[_tokenId];
        metadataTkn.isTransferable = _isTransferable;
        metadataTkn.amountUSDC = _amountValue;
    }



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

    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

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

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721Upgradeable, IERC721Upgradeable) {
        safeTransferFrom(from, to, tokenId, data);
    }

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
