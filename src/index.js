import { BigNumber, Contract, providers, ethers, utils } from "ethers";

// import usdcTknAbi ...
// import miPrimerTknAbi ...
// import publicSaleAbi ...
// import nftTknAbi ...

window.ethers = ethers;

var provider, signer, account;
var usdcTkContract, miPrTokenContract, nftTknContract, pubSContract;

// REQUIRED
// Conectar con metamask
function initSCsGoerli() {
  provider = new providers.Web3Provider(window.ethereum);

  var usdcAddress;
  var miPrTknAdd;
  var pubSContractAdd;

  usdcTkContract; // = Contract...
  miPrTokenContract; // = Contract...
  pubSContract; // = Contract...
}

// OPTIONAL
// No require conexion con Metamask
// Usar JSON-RPC
// Se pueden escuchar eventos de los contratos usando el provider con RPC
function initSCsMumbai() {
  var nftAddress;
  nftTknContract; // = new Contract...
}

function setUpListeners() {
  // Connect to Metamask
}

function setUpEventsContracts() {
  // nftTknContract.on
}

async function setUp() {
  initSCsGoerli();
  initSCsMumbai();
  await setUpListeners();
  setUpEventsContracts();
}

setUp()
  .then()
  .catch((e) => console.log(e));
