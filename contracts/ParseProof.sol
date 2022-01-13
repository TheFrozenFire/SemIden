pragma solidity ^0.8;

// SPDX-License-Identifier: MIT

import "https://github.com/smartcontractkit/solidity-stringutils/src/strings.sol";
import "https://github.com/Brechtpd/base64/base64.sol";

contract Example {
    using strings for *;

    function foo(uint hash, uint248[14] calldata input) public view returns (string memory, string memory) {
        require((hash >> 8) == input[0]);
        
        bytes memory jwt_data = signalsToBytes(input);

        (string memory sub_b64, string memory nonce_b64) = findClaims(jwt_data);

        strings.slice memory sub = string(Base64.decode(sub_b64)).toSlice();
        strings.slice memory nonce = string(Base64.decode(nonce_b64)).toSlice();

        sub = sub.find("\"sub\":\"".toSlice()).beyond("\"sub\":\"".toSlice()).rfind("\"".toSlice());
        sub._len -= 1;
        nonce = nonce.find("\"nonce\":\"".toSlice()).beyond("\"nonce\":\"".toSlice()).rfind("\"".toSlice());
        nonce._len -= 1;

        return (sub.toString(), nonce.toString());
    }

    function signalsToBytes(uint248[14] calldata input) internal pure returns (bytes memory) {
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
