pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./JWT.sol";
import "./JWKS.sol";

import "./Strings.sol";

interface IVerifier {
  function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[14] memory input) external returns (bool);
}

contract Identity is JWT {
  using StringUtils for *;

  JWKS public keys;
  IVerifier public immutable verifier;
  
  uint32 public constant NONCE_LENGTH = 10;
  
  mapping (string => bool) public subjects;
  
  constructor(JWKS _jwks, IVerifier _verifier) public payable {
    keys = _jwks;
    verifier = _verifier;
  }

  function insertBareIdentity(string memory headerJson, string memory payloadJson, bytes memory signature) public {
    string memory kid = JWT.parseHeader(headerJson);
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length != 0, "Key not found");
    require(JWT.checkMessageSignature(headerJson, payloadJson, signature, exponent, modulus) == 0, "RSA signature check failed");

    (string memory aud, string memory nonce, string memory sub) = JWT.parsePayload(payloadJson);

    string memory sender = string(abi.encodePacked(msg.sender));
    require(sender[2:NONCE_LENGTH+2].equals(nonce) == 0, "Sender does not match nonce");
    
    require(!subjects[sub], "Subject already exists");
    subjects[sub] = true; // Mark subject as existing
    
    
  }
  
  function insertProofIdentity(uint memory hash, bytes memory signature, string memory nonce, string memory sub, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[14] memory input) {
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length != 0, "Key not found");
    require(JWT.checkHashSignature(hash, signature, exponent, modulus) == 0, "RSA signature check failed");
    
    string memory sender = string(abi.encodePacked(msg.sender));
    require(sender[2:NONCE_LENGTH+2].equals(nonce) == 0, "Sender does not match nonce");
    
    require((hash >> 8) == input[0], "Hash does not match proof");
    
    
  }
}
