const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const { getRole, deploySC, deploySCNoUp, ex, pEth } = require("../utils");

const MINTER_ROLE = getRole("MINTER_ROLE");
const BURNER_ROLE = getRole("BURNER_ROLE");
const VERIFIER_ROLE = getRole("VERIFIER_ROLE");


const pe = ethers.utils.parseEther;
var makeBN = (num) => ethers.BigNumber.from(String(num));

describe("AFIRMACIONES VERIFICABLES TESTING", function () {
  let DBadgeContract, usdc;
  let owner, gnosis, alice, bob, carl, deysi;
  const name = "Digital Badge ";
  const symbol = "DBDG";

  before(async () => {
    [owner, gnosis, alice, bob, carl, deysi] = await ethers.getSigners();
  });

  // Estos dos métodos a continuación publican los contratos en cada red
  // Se usan en distintos tests de manera independiente
  // Ver ejemplo de como instanciar los contratos en deploy.js
  async function deployDbadge() {
    usdc = await deploySCNoUp("USDCoin")
    DBadgeContract = await deploySC("DigitalBadge", [name, symbol])
    //Setup
    await ex(DBadgeContract, "setTokenAddress", [usdc.address]);

  }


  describe("Setup", () => {
    // Se publica el contrato antes de cada test
    beforeEach(async () => {
      await deployDbadge();

    });

    it("Verifica nombre colección", async () => {
      expect(await DBadgeContract.name()).to.be.equal(name)
    });

    it("Verifica símbolo de colección", async () => {
      expect(await DBadgeContract.symbol()).to.be.equal(symbol)
    });

    it("No permite acuñar Insignia sin privilegio", async () => {
      await expect(DBadgeContract.connect(alice).safeMint(bob.address, "ss", true, 1000)).to.be.reverted
    });

    it("No permite Cambiar la direccion del token ERC20 sin privilegio", async () => {
      const tx = DBadgeContract.connect(alice).setTokenAddress(usdc.address)
      await expect(tx).to.be.reverted;
    });

    describe("Emision de Insignias Digitales", () => {
      beforeEach(async () => {
        //Emisor bob
        DBadgeContract.connect(owner).grantRole(MINTER_ROLE, bob.address);


      });


      it("Permite emitir insignia solo con privilegio MINTER", async () => {
        DBadgeContract.connect(owner).grantRole(MINTER_ROLE, deysi.address);
        expect(await DBadgeContract.connect(deysi).safeMint(bob.address, "ss", true, 1000))
          .to.be.satisfies
      });

      it("Emite evento  Transfer al titular", async () => {
        const tx = await DBadgeContract.connect(bob).safeMint(deysi.address, "ss", true, 1000)
        expect(tx).to.emit(DBadgeContract, "Transfer").withArgs(deysi.address, 0);

      });
      it("Se guarda correctamente el TokenUri ", async () => {
        const tokenUri = "https://gateway.pinata.cloud/ipfs/QmbQfRHsXr3ZGYv6tFcC7Vsjrpz2U8kf7nFiVVsPmptPrW"
        const tx = await DBadgeContract.connect(bob).safeMint(deysi.address, tokenUri, true, 1000)

        expect(tx).to.emit(DBadgeContract, "Transfer").withArgs(deysi.address, 0);

        expect(await DBadgeContract.tokenURI(0)).to.be.equal(tokenUri);

      });
      it("Se almacena en el contrato  el valorInsignia", async () => {

        const isTransferable = true;
        const valorInsignia = makeBN(1000);
        const tokenUri = "https://gateway.pinata.cloud/ipfs/QmbQfRHsXr3ZGYv6tFcC7Vsjrpz2U8kf7nFiVVsPmptPrW";
        const tx = await DBadgeContract.connect(bob)
          .safeMint(deysi.address, tokenUri, isTransferable, valorInsignia);

        expect(tx).to.emit(DBadgeContract, "Transfer").withArgs(deysi.address,);

        expect(await DBadgeContract.valueOfInsignia(0)).to.be.eq(valorInsignia);
        
      });
      it("Disminuye balance de MiPrimerToken luego de compra", async () => {

      });
    
    });



    describe("TITULAR", () => {
      beforeEach(async () => {

        //Emisor bob
        DBadgeContract.connect(owner).grantRole(MINTER_ROLE, bob.address);
        //titular Carl

      });


      it("Se pueden obtener las insignias del Titular", async () => {
        const cantInsignias = 5;
        for (let index = 0; index < cantInsignias; index++) {
          await DBadgeContract.connect(bob).safeMint(carl.address, "ss", true, 1000);
        }
        expect(await DBadgeContract.balanceOf(carl.address)).to.be.equal(cantInsignias);

        let idList = [];
        for (let index = 0; index < cantInsignias; index++) {
          const id = await DBadgeContract.tokenOfOwnerByIndex(carl.address,index);
          idList.push(id);
        }

        expect(await DBadgeContract.balanceOf(carl.address)).to.be.equal(idList.length);
        
      });

      it("", async () => {


      });
    
    });

    describe("VERIFICADOR", () => {
      beforeEach(async () => {

        //Emisor bob
        DBadgeContract.connect(owner).grantRole(MINTER_ROLE, bob.address);
        //titular Carl

      });


      it("Se pueden obtener las insignias del Titular", async () => {
        const cantInsignias = 5;
        for (let index = 0; index < cantInsignias; index++) {
          await DBadgeContract.connect(bob).safeMint(carl.address, "ss", true, 1000);
        }
        expect(await DBadgeContract.balanceOf(carl.address)).to.be.equal(cantInsignias);

        let idList = [];
        for (let index = 0; index < cantInsignias; index++) {
          const id = await DBadgeContract.tokenOfOwnerByIndex(carl.address,index);
          idList.push(id);
        }

        expect(await DBadgeContract.balanceOf(carl.address)).to.be.equal(idList.length);
        
      });

      it("", async () => {


      });
    
    });

    


  });


});
