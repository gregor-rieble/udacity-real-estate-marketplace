pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./SquareVerifier.sol";


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
  // define a solutions struct that can hold an index & an address
  struct Solution {
    uint256 index;
    address addr;
    bool minted;
  }

  // define an array of the above struct
  Solution[] private _solutionsList;

  // define a mapping to store unique solutions submitted
  mapping(bytes32 => Solution) _solutions;

  // Create an event to emit when a solution is added
  event SolutionAdded(bytes32 key, uint256 index, address addr);
  
  // define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
  SquareVerifier private _verifier;

  constructor(string memory symbol, string memory name, address verifierAddress) public
    ERC721MintableComplete(symbol, name)
  {
    _verifier = SquareVerifier(verifierAddress);
  }

  // Create a function to add the solutions to the array and emit the event
  function addSolution(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) 
    public 
    returns (bytes32 key, uint256 index, address addr) 
  {
    // dont use modifier to prevent calculating hash multiple times
    key = generateKey(a, b, c, input);
    require(_solutions[key].addr == address(0), "The solution has already been used!");
    require(_verifier.verifyTx(a, b, c, input), "Solution is not valid!");

    index = _solutionsList.length;
    addr = msg.sender;

    Solution storage solution = _solutions[key];
    solution.index = index;
    solution.addr = addr;

    _solutionsList.push(solution);

    emit SolutionAdded(key, index, addr);

    return (key, index, addr);
  }

  // Create a function to mint new NFT only after the solution has been verified
  //  - make sure the solution is unique (has not been used before)
  //  - make sure you handle metadata as well as tokenSuplly
  function mint(uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
    // dont use modifier to prevent calculating hash multiple times
    bytes32 key = generateKey(a, b, c, input);
    require(_solutions[key].addr == msg.sender, "You are not the owner of the provided solution!");
    require(!_solutions[key].minted, "This solution has already been used to mint a token!");

    _solutions[key].minted = true;

    super._mint(msg.sender, tokenId);
  }

  function generateKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) internal pure returns (bytes32) {
    return (keccak256(abi.encodePacked(a, b, c, input)));
  }
}






  


























