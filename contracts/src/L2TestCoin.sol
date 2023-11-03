// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { ERC20 } from "solmate/tokens/ERC20.sol";
import { Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract L2TestCoin is ERC20 {
  constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20(_name, _symbol, _decimals) {
  }

  function mintTo(address _to, uint256 _amount) public {
    _mint(_to, _amount);
  }

  function getTotalSupplyStorageSlot() pure public returns (uint256 slot) {
    assembly {
      slot := totalSupply.slot
    }
  }

  function getBalanceOfStorageSlot() pure public returns (uint256 slot) {
    assembly {
      slot := balanceOf.slot
    }
  }

}
