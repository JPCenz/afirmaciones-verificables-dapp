require("dotenv").config();

const {
    getRole,
    verify,
    ex,
    printAddress,
    deploySC,
    deploySCNoUp,
} = require("../utils");



async function deployMumbai() {


    // set up
    //await ex(nftTknContract, "grantRole", [MINTER_ROLE, relayerAddress], "GR");
    console.log("Verificacion: ");
    await verify("0xD757DAC2E6dCC625AF9c17aB15678cE83Ed5b6Ac", "DigitalBadge", []);
}


deployMumbai()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });