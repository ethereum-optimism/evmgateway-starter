// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC721 } from "solmate/tokens/ERC721.sol";
import { Strings} from "@openzeppelin/contracts/utils/Strings.sol";


contract L2TestNFT is ERC721 {

  uint256 public currentTokenId;

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
  }

  function mintTo(address _to) public returns (uint256) {
    uint256 newTokenId = currentTokenId++;
    _safeMint(_to, newTokenId);
    return newTokenId;
  }

  function tokenURI(uint256 id) public pure override returns (string memory) {
    return Strings.toString(id);
  }

  function getBalanceOfStorageSlot() pure public returns (uint256 slot) {
    assembly {
      slot := _balanceOf.slot
    }
  }
}
