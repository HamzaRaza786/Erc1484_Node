require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const ALCHEMY_API_KEY = "https://eth-rinkeby.alchemyapi.io/v2/d-P-J1kOKNI_oKYh2DO90JWCkOx8tFJB"
const ROPSTEN_PRIVATE_KEY = "375d5016e16f25546bbe2e86da0f3d6a1bad8d23872a62b168a550d41ff2220d"
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY,
      accounts: [`0x${ROPSTEN_PRIVATE_KEY}`],
    },
  },
};
