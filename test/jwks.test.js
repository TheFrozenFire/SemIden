const JWKS = artifacts.require("JWKS");

const fs = require('fs');

const google_jwks = JSON.parse(fs.readFileSync(__dirname + "/fixtures/google_jwks.json").toString());

contract("JWKS", accounts => {
  it('adding key returns correct modulus', async () => {
    const instance = await JWKS.deployed();
    
    await Promise.all(google_jwks['keys'].map(key => instance.addKey(key['kid'], "0x" + Buffer.from(key['n'], 'base64').toString('hex'))));
    
    const key = google_jwks['keys'][0];
    const modulus = await instance.getModulus(key['kid']);
    
    // Arrayify prefixes hex strings with 0x, and base64 needs to be converted to "URL safe"
    const modulusBase64 = Buffer.from(modulus.slice(2), 'hex').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    
    assert.equal(
        modulusBase64,
        key['n'],
        "Returned modulus didn't match expected value"
    );
  });

});
