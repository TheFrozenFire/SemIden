const Migrations = artifacts.require("Migrations");

const JWKS = artifacts.require("JWKS");
const JWT = artifacts.require("JWT");
const Identity = artifacts.require("Identity");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  
//  deployer.deploy(JWKS);
//  deployer.deploy(JWT);
//  deployer.deploy(Identity);
  
};
