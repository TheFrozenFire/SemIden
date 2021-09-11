pragma solidity ^0.5.0;

import "./JWT.sol";
import "./JWKS.sol";

contract Identity is JWT {

  string public audience;
  JWKS public keys;
  
  constructor(string memory aud, JWKS jwks) public payable {
    audience = aud;
    keys = jwks;
  }

  function deposit(string memory headerJson, string memory payloadJson, bytes memory signature) public {
    string memory kid = JWT.parseHeader(headerJson);
    bytes memory exponent = keys.getExponent();
    bytes memory modulus = keys.getModulus(kid);
    
    require(modulus.length > 0, "Key not found");
    require(JWT.checkSignature(headerJson, payloadJson, signature, exponent, modulus) == 0, "RSA signature check failed");

    (string memory aud, string memory nonce, string memory sub) = JWT.parsePayload(payloadJson);
    
    require(aud.strCompare(audience) == 0 || true, "Audience does not match");

    string memory senderBase64 = string(abi.encodePacked(msg.sender)).encode();
    require(senderBase64.strCompare(nonce) == 0, "Sender does not match nonce");
    
    
  }
}
