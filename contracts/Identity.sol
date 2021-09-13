pragma solidity ^0.5.0;

import "./JWT.sol";
import "./JWKS.sol";
import "./SemaphoreClient.sol";

contract Identity is JWT, SemaphoreClient {

  string public audience;
  JWKS public keys;
  
  mapping (string => bool) public subjects;
  
  constructor(string memory aud, JWKS jwks, Semaphore sem) SemaphoreClient(sem) public payable {
    audience = aud;
    keys = jwks;
  }

  function insertIdentity(string memory headerJson, string memory payloadJson, bytes memory signature, uint256 identityCommitment) public {
    string memory kid = JWT.parseHeader(headerJson);
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length != 0, "Key not found");
    require(JWT.checkSignature(headerJson, payloadJson, signature, exponent, modulus) == 0, "RSA signature check failed");

    (string memory aud, string memory nonce, string memory sub) = JWT.parsePayload(payloadJson);
    
    require(aud.strCompare(audience) == 0, "Audience does not match");

    string memory senderBase64 = string(abi.encodePacked(msg.sender)).encode();
    require(senderBase64.strCompare(nonce) == 0, "Sender does not match nonce");
    
    require(!subjects[sub], "Subject already exists");
    subjects[sub] = true; // Mark subject as existing
    
    insertIdentityAsClient(identityCommitment);
  }
}
