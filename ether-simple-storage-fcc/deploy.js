const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcBatchProvider(
    process.env.RPC_URL
  );

  // it's an open source wallet private key, not best practice, but still
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait");

  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  const currentFavouriteNumber = await contract.retrieve();
  console.log(currentFavouriteNumber.toString());

  const transactionResponse = await contract.store("1");
  transactionResponse.wait(1);

  const updatedFavouriteNumber = await contract.retrieve();
  console.log(updatedFavouriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
