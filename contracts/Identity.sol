pragma solidity ^0.5.0;

import "./JWT.sol";
import "./JWKS.sol";
import "semaphore/contracts/sol/Semaphore.sol";

contract Identity is JWT {

  string public audience;
  JWKS public keys;
  Semaphore public semaphore;
  mapping (string => bool) public subjects;
  
  constructor(string memory aud, JWKS jwks, Semaphore sem) public payable {
    audience = aud;
    keys = jwks;
    semaphore = sem;
  }

  function deposit(string memory headerJson, string memory payloadJson, bytes memory signature) public {
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
  }
}
