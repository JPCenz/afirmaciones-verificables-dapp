require("dotenv").config();

const {
  getRole,
  verify,
  ex,
  printAddress,
  deploySC,
  deploySCNoUp,
} = require("../utils");

var MINTER_ROLE = getRole("MINTER_ROLE");
var BURNER_ROLE = getRole("BURNER_ROLE");

async function deployMumbai() {
  var name = "Digital Badge";
  var symbol = "DBT";
  var nftContract = await deploySC("DigitalBadge", [name, symbol]);
  var implementation = await printAddress("Digital Badge:", nftContract.address);

  // set up
  //await ex(nftTknContract, "grantRole", [MINTER_ROLE, relayerAddress], "GR");
  console.log("Verificacion: ");
  await verify(implementation, "MiPrimerNft", []);
}


deployMumbai()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
