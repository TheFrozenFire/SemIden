const fs = require('fs');
const assert = require('assert');

const JWKS = artifacts.require("JWKS");
const Identity = artifacts.require("Identity");

const google_jwt = fs.readFileSync(__dirname + "/fixtures/google_jwt").toString();
const google_jwks = JSON.parse(fs.readFileSync(__dirname + "/fixtures/google_jwks.json").toString());

contract("Identity", accounts => {
  async function setupInstance(audience, jwks, keys) {
    audience = audience ? audience : "390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com";
    keys = keys ? keys : google_jwks['keys'];
  
    jwks = jwks ? jwks : await JWKS.new();
    const instance = await Identity.new(audience, jwks.address);
    
    await Promise.all(keys.map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    return instance;
  }
  
  function setupJwt() {
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    return [headerJson, payloadJson, signatureHex];
  }
  
  before(async () => {
    // Static sender account 0x58d1516a240f4b8acdf53e45be7f6675c6338a68 (WNFRaiQPS4rN9T5Fvn9mdcYzimg)
    const senderAccount = await web3.eth.personal.importRawKey('0xcd78afcf11ef47370b1ff5ed34bb76365a46314af4bbf96e5340fc12f5d36d5a', 'test');
    await web3.eth.personal.unlockAccount(senderAccount, 'test', 60);
    
    Identity.defaults({
        from: senderAccount
    });
    
    await web3.eth.sendTransaction({
        from: accounts[0],
        to: senderAccount,
        value: 1e18
    })
  });

  it('depositing a token without a valid key fails', async () => {
    const instance = await setupInstance(undefined,undefined,undefined,[]);
    const [headerJson, payloadJson, signatureHex] = setupJwt();
    
    await assert.rejects(instance.insertIdentity(headerJson, payloadJson, signatureHex, 0), /Key not found/, "Token doesn't have a valid key, and should have rejected");
  });
  
  it('depositing a token with an invalid signature fails', async () => {
    const instance = await setupInstance();
    
    const [headerJson, payloadJson] = setupJwt();
    const signatureHex = "0x";
    
    await assert.rejects(instance.insertIdentity(headerJson, payloadJson, signatureHex, 0), /RSA signature check failed/, "Token has an invalid signature, and should have rejected");
  });
  
  it('depositing a token with an invalid audience fails', async () => {
    const instance = await setupInstance("imaginary-audience.apps.googleusercontent.com");
    const [headerJson, payloadJson, signatureHex] = setupJwt();
    
    await assert.rejects(instance.insertIdentity(headerJson, payloadJson, signatureHex, 0), /Audience does not match/, "Token has an invalid audience, and should have rejected");
  });
  
  it('depositing a token with a nonce different than sender fails', async () => {
    const instance = await setupInstance();
    const [headerJson, payloadJson, signatureHex] = setupJwt();
    
    Identity.defaults({from: accounts[0]});
    
    await assert.rejects(instance.insertIdentity(headerJson, payloadJson, signatureHex, 0), /Sender does not match nonce/, "Token has a nonce that does not match sender, and should have rejected");
    
    Identity.defaults({from: "0x58d1516a240f4b8acdf53e45be7f6675c6338a68"});
  });
  
  it('depositing a token twice fails', async () => {
    const instance = await setupInstance();
    const [headerJson, payloadJson, signatureHex] = setupJwt();
    const identityCommitment = setupIdentity()[1];
    
    await instance.insertIdentity(headerJson, payloadJson, signatureHex, identityCommitment);
    await assert.rejects(instance.insertIdentity(headerJson, payloadJson, signatureHex, identityCommitment), /Subject already exists/, "Token was deposited twice, and should have rejected");
  });
});
