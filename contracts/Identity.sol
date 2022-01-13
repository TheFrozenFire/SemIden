pragma solidity ^0.8;

// SPDX-License-Identifier: MIT

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./JWT.sol";
import "./JWKS.sol";

import "https://github.com/smartcontractkit/solidity-stringutils/src/strings.sol";
import "https://github.com/Brechtpd/base64/base64.sol";

interface IVerifier {
  function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[14] memory input) external returns (bool);
}

contract Identity is JWT {

  using strings for *;

  JWKS public keys;
  IVerifier public immutable verifier;
  
  uint32 public constant NONCE_LENGTH = 10;
  
  mapping (string => bool) public subjects;
  
  constructor(JWKS _jwks, IVerifier _verifier) public payable {
    keys = _jwks;
    verifier = _verifier;
  }

  /*function insertBareIdentity(string memory headerJson, string memory payloadJson, bytes memory signature) public {
    string memory kid = JWT.parseHeader(headerJson);
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length != 0, "Key not found");
    require(JWT.checkMessageSignature(headerJson, payloadJson, signature, exponent, modulus) == 0, "RSA signature check failed");

    (string memory aud, string memory nonce, string memory sub) = JWT.parsePayload(payloadJson);

    string memory sender = string(abi.encodePacked(msg.sender));
    require(sender[2:NONCE_LENGTH+2].toSlice().equals(nonce.toSlice()), "Sender does not match nonce");
    
    require(!subjects[sub], "Subject already exists");
    subjects[sub] = true; // Mark subject as existing
    
    
  }*/
  
  function insertProofIdentity(string memory kid, uint hash, bytes memory signature, string memory nonce, string memory sub, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[14] calldata input) public {
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length != 0, "Key not found");
    require(JWT.checkHashSignature(bytes32(abi.encodePacked(hash)), signature, exponent, modulus) == 0, "RSA signature check failed");
    
    string memory sender = string(abi.encodePacked(msg.sender));
    require(sender.toSlice().beyond("0x".toSlice()).equals(nonce.toSlice()), "Sender does not match nonce");
    
    require((hash >> 8) == input[0], "Hash does not match proof");
    
    checkClaims(nonce, sub, input);
  }

  function checkClaims(string memory nonce, string memory sub, uint[14] calldata input) internal pure {
    bytes memory jwt_data = signalsToBytes(inputsToSignals(input));

    (string memory jwt_sub_b64, string memory jwt_nonce_b64) = findClaims(jwt_data);

    strings.slice memory jwt_sub = string(Base64.decode(jwt_sub_b64)).toSlice();
    strings.slice memory jwt_nonce = string(Base64.decode(jwt_nonce_b64)).toSlice();

    require(jwt_sub.contains("\"sub\":\"".toSlice().concat(sub.toSlice()).toSlice().concat("\"".toSlice()).toSlice()));
    require(jwt_nonce.contains("\"nonce\":\"".toSlice().concat(nonce.toSlice()).toSlice().concat("\"".toSlice()).toSlice()));
  }

  function inputsToSignals(uint[14] calldata input) internal pure returns (uint248[14] memory signals) {
      for(uint i = 0; i < 14; i++) {
          signals[i] = uint248(input[i]);
      }
  }

  function signalsToBytes(uint248[14] memory input) internal pure returns (bytes memory) {
      return abi.encodePacked(input[1], input[2], input[3], input[4], input[5], input[6], input[7], input[8], input[9], input[10], input[11], input[12], input[13]);
  }

  function findClaims(bytes memory input) internal pure returns (string memory, string memory) {
      uint start = 0;
      bytes memory sub;
      bytes memory nonce;

      (start, sub) = findClaim(input, start);
      (start, nonce) = findClaim(input, start);

      return (string(sub), string(nonce));
  }

  function findClaim(bytes memory input, uint start) internal pure returns (uint, bytes memory) {
      bool found = false;
      uint begin;
      uint end;
      do {
          if(found) {
              if(input[start] == 0) {
                  end = start;
                  break;
              }
          } else {
              if(input[start] != 0) {
                  found = true;
                  begin = start;
              }
          }
      } while(++start < input.length);

      bytes memory result = new bytes(end - begin);

      for(uint i = 0; i < (end-begin); i++) {
          result[i] = input[begin + i];
      }

      return (start, result);
  }
}

