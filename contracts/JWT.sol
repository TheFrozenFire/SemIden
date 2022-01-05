pragma solidity ^0.5.0;

import "./Base64.sol";
import "./JsmnSolLib.sol";
import "./SolRsaVerify.sol";
import "./Strings.sol";

contract JWT {

    using Base64 for string;
    using StringUtils for *;
    using SolRsaVerify for *;
    using JsmnSolLib for string;
    
    function checkHashSignature(bytes32 memory hash, bytes memory signature, bytes memory exponent, bytes memory modulus) public view returns (uint) {
        return pkcs1Sha256Verify(hash, signature, exponent, modulus);
    }
    
    function checkMessageSignature(string memory headerJson, string memory payloadJson, bytes memory signature, bytes memory exponent, bytes memory modulus) public view returns (uint) {
        string memory headerBase64 = headerJson.encode();
        string memory payloadBase64 = payloadJson.encode();
        StringUtils.slice[] memory slices = new StringUtils.slice[](2);
        slices[0] = headerBase64.toSlice();
        slices[1] = payloadBase64.toSlice();
        string memory message = ".".toSlice().join(slices);
        
        return message.pkcs1Sha256VerifyStr(signature, exponent, modulus);
    }
    
    function parseHeader(string memory json) public pure returns (string memory kid) {
        (uint exitCode, JsmnSolLib.Token[] memory tokens, uint ntokens) = json.parse(20);
        require(exitCode == 0, "JSON parse failed");
        
        require(tokens[0].jsmnType == JsmnSolLib.JsmnType.OBJECT, "Expected JWT to be an object");
        uint i = 1;
        while (i < ntokens) {
          require(tokens[i].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected JWT to contain only string keys");
          string memory key = json.getBytes(tokens[i].start, tokens[i].end);
          if (key.strCompare("kid") == 0) {
            require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected kid to be a string");
            return json.getBytes(tokens[i+1].start, tokens[i+1].end);
          }
          i += 2;
        }
    }
    
    function parsePayload(string memory json) public pure returns (string memory aud, string memory nonce, string memory sub) {
        (uint exitCode, JsmnSolLib.Token[] memory tokens, uint ntokens) = json.parse(40);
        require(exitCode == 0, "JSON parse failed");
        
        require(tokens[0].jsmnType == JsmnSolLib.JsmnType.OBJECT, "Expected JWT to be an object");
        uint i = 1;
        while (i < ntokens) {
          require(tokens[i].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected JWT to contain only string keys");
          string memory key = json.getBytes(tokens[i].start, tokens[i].end);
          if (key.strCompare("sub") == 0) {
            require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected sub to be a string");
            sub = json.getBytes(tokens[i+1].start, tokens[i+1].end);
          } else if (key.strCompare("aud") == 0) {
            require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected aud to be a string");
            aud = json.getBytes(tokens[i+1].start, tokens[i+1].end);
          } else if (key.strCompare("nonce") == 0) {
            require(tokens[i+1].jsmnType == JsmnSolLib.JsmnType.STRING, "Expected nonce to be a string");
            nonce = json.getBytes(tokens[i+1].start, tokens[i+1].end);
          }
          i += 2;
        }
    }
}
