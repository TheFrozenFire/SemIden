const JWT = artifacts.require("JWT");

const fs = require('fs');

const google_jwt = fs.readFileSync(__dirname + "/fixtures/google_jwt").toString();
const google_jwks = JSON.parse(fs.readFileSync(__dirname + "/fixtures/google_jwks.json").toString());

contract("JWT", accounts => {
  it('signature verifies correctly', async () => {
    const instance = await JWT.deployed();
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    const kid = JSON.parse(headerJson)['kid'];
    
    const key = google_jwks['keys'].find(key => key['kid'] == kid);
    const exponent = "0x" + Buffer(key['e'], 'base64').toString('hex');
    const modulus = "0x" + Buffer(key['n'], 'base64').toString('hex');
    
    const result = (await instance.checkSignature(headerJson, payloadJson, signatureHex, exponent, modulus)).toNumber();
    
    assert.equal(result, 0, "Signature verification failed");
  });
  
  it('token header parsing returns expected kid', async () => {
    const instance = await JWT.deployed();
  
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    
    const kid = await instance.parseHeader(headerJson);
    
    assert.equal(kid, "991b0636aada341c5a08e0d8f2406972064dc8ed", "Token header doesn't contain expected kid");
  });
  
  it('token payload parsing returns expected fields', async () => {
    const instance = await JWT.deployed();
    
    const [header, payload, signature] = google_jwt.split('.');
    const payloadJson = Buffer.from(payload, 'base64').toString();
    
    const {aud, nonce, sub} = await instance.parsePayload(payloadJson);
    
    assert.equal(aud, "390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com");
    assert.equal(nonce, "WNFRaiQPS4rN9T5Fvn9mdcYzimg");
    assert.equal(sub, "114482386540964754644");
  });

});
