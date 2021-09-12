const MiMC = artifacts.require("MiMC");
const Pairing = artifacts.require("Pairing");
const Semaphore = artifacts.require("Semaphore");

module.exports = async function (deployer) {
    await deployer.deploy(MiMC);
    await deployer.deploy(Pairing);
    await deployer.link(MiMC, Semaphore);
    await deployer.link(Pairing, Semaphore);
    await deployer.deploy(Semaphore, 20, 0);
};
