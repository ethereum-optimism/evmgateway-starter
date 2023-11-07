// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC721 } from "solmate/tokens/ERC721.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { EVMFetchTarget } from './evm-verifier/EVMFetchTarget.sol';
import { IEVMVerifier } from './evm-verifier/IEVMVerifier.sol';
import { EVMFetcher } from './evm-verifier/EVMFetcher.sol';

contract L1PassportNFT is ERC721, EVMFetchTarget {
  using EVMFetcher for EVMFetcher.EVMFetchRequest;

  error TokenIsSoulbound();

  string public constant SVG_PREFIX = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 400 400"><style>.text { fill: white; font-family: monospace }</style><rect width="100%" height="100%" fill="#ea3431" ry="20" rx="20"/><text class="text" font-weight="bold" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="32" y="15%" x="50%">OP Goerli Passport</text>';

  IEVMVerifier public verifier;
  address public l2TestCoinAddress;
  address public l2TestNFTAddress;

  constructor(string memory _name, string memory _symbol, IEVMVerifier _evmVerifier, address _l2TestCoinAddress, address _l2TestNFTAddress) ERC721(_name, _symbol) {
    verifier = _evmVerifier;
    l2TestCoinAddress = _l2TestCoinAddress;
    l2TestNFTAddress = _l2TestNFTAddress;
  }

  function mintTo(address _to) public returns (uint256) {
    uint256 newTokenId = uint256(uint160(_to));
    _safeMint(_to, newTokenId);
    return newTokenId;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
    address tokenOwner = ownerOf(id);

    bytes memory callbackData = abi.encode(id, tokenOwner);

    EVMFetcher.newFetchRequest(verifier, l2TestCoinAddress)
      .getStatic(2) // fetch totalSupply of L2TestCoin ERC20 token
      .getStatic(3) // fetch balance of owner for L2TestCoin ERC20 token
        .element(tokenOwner)
      .fetch(this.tokenURIFetchL2TestCoinBalanceCallback.selector, callbackData);
  }

  function tokenURIFetchL2TestCoinBalanceCallback(bytes[] memory _values, bytes memory _callbackData) public view returns (string memory) {
    uint256 l2TestCoinTotalSupply = abi.decode(_values[0], (uint256));
    uint256 l2TestCoinBalance = abi.decode(_values[1], (uint256));

    (uint256 tokenId, address tokenOwner) = abi.decode(_callbackData, (uint256, address));

    bytes memory updatedCallbackData = abi.encode(tokenId, tokenOwner, l2TestCoinTotalSupply, l2TestCoinBalance);

    EVMFetcher.newFetchRequest(verifier, l2TestNFTAddress)
      .getStatic(3) // fetch balance of owner for L2TestNFT ERC721 token
        .element(tokenOwner)
      .fetch(this.tokenURIFetchL2TestNFTBalanceCallback.selector, updatedCallbackData);
  }

  function tokenURIFetchL2TestNFTBalanceCallback(bytes[] memory _values, bytes memory _callbackData) public pure returns (string memory) {
    (uint256 tokenId, address tokenOwner, uint256 l2TestCoinTotalSupply, uint256 l2TestCoinBalance) = abi.decode(_callbackData, (uint256, address, uint256, uint256));

    uint256 l2NftBalance = abi.decode(_values[0], (uint256));

    return _getTokenUri(tokenId, tokenOwner, l2TestCoinTotalSupply, l2TestCoinBalance, l2NftBalance);
  }

  // Simple souldbound NFT implementation from https://github.com/The-Arbiter/ERC721Soulbound
  function onlySoulbound(address from, address to) internal pure {
    // Revert if transfers are not from the 0 address and not to the 0 address
    if (from != address(0) && to != address(0)) {
        revert TokenIsSoulbound();
    }
  }

  function transferFrom(address from, address to, uint256 id) public override {
    onlySoulbound(from, to);
    super.transferFrom(from, to, id);
  }

  function _getTokenUri(
    uint256 _tokenId,
    address _user,
    uint256 _erc20TotalSupply,
    uint256 _erc20Balance,
    uint256 _erc721Balance
  ) internal pure returns (string memory) {

    bytes memory dataURI = abi.encodePacked(
      "{",
      '"name": "OP Goerli Passport #',
      Strings.toString(_tokenId),
      '",',
      '"description": "OP Goerli Passport",',
      '"image": "',
      _renderSvg(_user, _erc20TotalSupply, _erc20Balance, _erc721Balance),
      '"',
      "}"
    );

    return
      string(
        abi.encodePacked(
          "data:application/json;base64,",
          Base64.encode(dataURI)
        )
      );
    }


  function _renderSvg(
    address _tokenOwner,
    uint256 _erc20TotalSupply,
    uint256 _erc20Balance,
    uint256 _erc721Balance
  ) internal pure returns (string memory) {

    bytes memory svg = abi.encodePacked(
      SVG_PREFIX,
      '<text class="text" font-size="20" dominant-baseline="middle" text-anchor="middle" y="45%" x="50%">Owns ',
      Strings.toString(_erc721Balance),
      " L2TestNFT</text>",
      '<text class="text" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="20" y="60%" x="50%">Owns ',
      Strings.toString(_erc20Balance),
      "/",
      Strings.toString(_erc20TotalSupply),
      " L2TestCoin</text>",
      '<text class="text" dominant-baseline="middle" text-anchor="middle" font-size="14" y="90%" x="50%">',
      Strings.toHexString(_tokenOwner),
      "</text>",
      "</svg>"
    );

    return string(
      abi.encodePacked(
        "data:image/svg+xml;base64,",
        Base64.encode(svg)
      )
    );
  }
}
