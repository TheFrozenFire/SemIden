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
  
    const jwks = await JWKS.new();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await instance.deposit(headerJson, payloadJson, signatureHex);
    
    Identity.defaults({from: accounts[0]});
  });
  
  it('depositing a token without a valid key fails', async () => {
    const jwks = await JWKS.new();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /Key not found/, "Token doesn't have a valid key, and should have rejected");
  });
  
  it('depositing a token with an invalid signature fails', async () => {
    const jwks = await JWKS.new();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x";
    
    await assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /RSA signature check failed/, "Token has an invalid signature, and should have rejected");
  });
  
  it('depositing a token with an invalid audience fails', async () => {
    const jwks = await JWKS.new();
    const instance = await Identity.new("imaginary.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /Audience does not match/, "Token has an invalid audience, and should have rejected");
  });
  
  it('depositing a token with a nonce different than sender fails', async () => {
    const jwks = await JWKS.new();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /Sender does not match nonce/, "Token has a nonce that does not match sender, and should have rejected");
  });
  
  it('depositing a token twice fails', async () => {
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
  
    const jwks = await JWKS.new();
    const instance = await Identity.new("390443847062-2d84rt4j07136tpakj9enl9g6qvnvd7b.apps.googleusercontent.com", jwks.address);
    
    await Promise.all(google_jwks['keys'].map(key => jwks.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const [header, payload, signature] = google_jwt.split('.');
    const headerJson = Buffer.from(header, 'base64').toString();
    const payloadJson = Buffer.from(payload, 'base64').toString();
    const signatureHex = "0x" + Buffer.from(signature, 'base64').toString('hex');
    
    await instance.deposit(headerJson, payloadJson, signatureHex);
    await assert.rejects(instance.deposit(headerJson, payloadJson, signatureHex), /Subject already exists/, "Token was deposited twice, and should have rejected");
    
    Identity.defaults({from: accounts[0]});
  });
});
