// SPDX-License-Identifier: MIT

/*

  by steviep.eth

*/


pragma solidity ^0.8.17;

import "./Dependencies.sol";


contract TestContract is ERC721, Ownable {
  TestURI public uriContract;
  TestMinter public minterContract;

  uint256 public totalSupply;
  address private _royaltyBeneficiary;
  uint16 private _royaltyBasisPoints = 1000;

  uint256 public constant MAX_SUPPLY = 128;


  event MetadataUpdate(uint256 _tokenId);
  event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);


  constructor () ERC721('Test Contract', 'TEST') {
    _royaltyBeneficiary = msg.sender;
    uriContract = new TestURI(msg.sender);
    minterContract = new TestMinter(msg.sender);
  }

  function exists(uint256 tokenId) external view returns (bool) {
    return _exists(tokenId);
  }


  function mint(address recipient, uint256 tokenId) external {
    require(totalSupply < MAX_SUPPLY, 'Cannot exceed MAX_SUPPLY');
    _mint(recipient, tokenId);
    totalSupply++;
  }



  function setTokenURIContract(TestURI newContract) external onlyOwner {
    uriContract = TestURI(newContract);
    emit BatchMetadataUpdate(0, totalSupply);
  }

  function setMinterContract(TestMinter newMinter) external onlyOwner {
    minterContract = newMinter;
  }

  function setRoyaltyInfo(
    address royaltyBeneficiary,
    uint16 royaltyBasisPoints
  ) external onlyOwner {
    _royaltyBeneficiary = royaltyBeneficiary;
    _royaltyBasisPoints = royaltyBasisPoints;
  }

  function royaltyInfo(uint256, uint256 _salePrice) external view returns (address, uint256) {
    return (_royaltyBeneficiary, _salePrice * _royaltyBasisPoints / 10000);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721) returns (bool) {
    // ERC2981 & ERC4906
    return interfaceId == bytes4(0x2a55205a) || interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
  }
}



contract TestURI is Ownable {
  using Strings for uint256;

  TestContract public baseContract;
  string public description = '';
  string public externalUrl = '';
  string public license = 'CC BY-NC 4.0';

  constructor(address o) {
    baseContract = TestContract(msg.sender);
    transferOwnership(o);
  }

  function tokenURI(uint256 tokenId) external view returns (string memory) {

    bytes memory json = abi.encodePacked(
      'data:application/json;utf8,',
      '{"name": "",',
      '"description": "', description, '",',
      '"license": "', license, '",',
      '"external_url": "', externalUrl, '",',
      '"attributes":', attributes(tokenId), ',',
      '"image": "', encodedSVG(tokenId),
      '"}'
    );
    return string(json);
  }

  function attributes(uint256 tokenId) public view returns (string memory) {
    return string(abi.encodePacked(
      '[{"trait_type": "", "value": ""}]'
    ));
  }

  function encodedSVG(uint256 hash) public view returns (string memory) {
    return string(abi.encodePacked(
      'data:image/svg+xml;base64,',
      Base64.encode(rawSVG(hash))
    ));
  }


  function rawSVG(uint256 hash) public view returns (bytes memory) {
    bytes memory svg = abi.encodePacked(
      '<svg viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">'
      '<rect x="0" y="0" width="2048" height="2048" fill="#000" />'
      '</svg>'
    );

    return svg;
  }


  function updateMetadata(string calldata _externalUrl, string calldata _description, string calldata _license) external  onlyOwner {
    externalUrl = _externalUrl;
    description = _description;
    license = _license;
  }
}



contract TestMinter is Ownable {
  TestContract public baseContract;
  address beneficiary;

  uint256 public priceInWei;

  constructor(address o) {
    baseContract = TestContract(msg.sender);
    transferOwnership(o);
    beneficiary = o;
  }

  function mint() public payable {
    require(msg.value >= priceInWei, "Insufficient payment");
    payable(beneficiary).transfer(msg.value);
    baseContract.mint(msg.sender, baseContract.totalSupply());
  }

  function updatePrice(uint256 _newPrice) external onlyOwner {
     priceInWei = _newPrice;
  }

  function updateBeneficiary(address _newBeneficiary) external onlyOwner {
     beneficiary = _newBeneficiary;
  }

}