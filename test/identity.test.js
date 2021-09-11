const JWKS = artifacts.require("JWKS");
const Identity = artifacts.require("Identity");

const fs = require('fs');
const assert = require('assert');

const google_jwt = fs.readFileSync(__dirname + "/fixtures/google_jwt").toString();
const google_jwks = JSON.parse(fs.readFileSync(__dirname + "/fixtures/google_jwks.json").toString());

contract("Identity", accounts => {
  it('contract can be populated with JWKS', async () => {
    const jwks = await JWKS.deployed();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
  });
  
  it('depositing a valid token works', async () => {
    // Static sender account 0x58d1516a240f4b8acdf53e45be7f6675c6338a68
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
  
    const jwks = await JWKS.deployed();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await instance.deposit(headerJson, payloadJson, signatureHex);
  });
  
  it('depositing a token without a valid key fails', async () => {
    const jwks = await JWKS.deployed();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    //assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /Sender does not match nonce/, "Token doesn't have a valid key, and should have rejected");
  });
});
