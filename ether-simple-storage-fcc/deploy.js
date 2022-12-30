const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  const provider = new ethers.providers.JsonRpcBatchProvider(
    "http://127.0.0.1:7545"
  );

  // it's an open source wallet private key, not best practice, but still
  const wallet = new ethers.Wallet(
    "f1522562fe9649d0c884cbdef64e977bb10293c23690808a2b2002d1c8c0e03f",
    provider
  );
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
