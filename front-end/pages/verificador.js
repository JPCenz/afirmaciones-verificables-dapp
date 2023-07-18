import { useWeb3Context } from "@/context/web3Context";
import axios from "axios";
import useDigitalBadgeContract from "@/hooks/useBadgeContract";
import { decodeBase64, encodeBase64, ethers } from "ethers";
import { list } from "postcss";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import useUSDCContract from "@/hooks/useUSDCContract";



export default function TestVerificador() {

  let [insignias, setInsignias] = useState([]);
  let [searchAccount, setSearchAccount] = useState("");
  const [usdcBalance, setUsdcBalance] = useState("");

  const ref = useRef(null);
  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChain, provider },
  } = useWeb3Context();

  const contract = useDigitalBadgeContract();
  const usdcContract = useUSDCContract();

  const dencrypt = async (data) => {
    try {

      const keyB64 = await window.ethereum.request({
        method: 'eth_getEncryptionPublicKey',
        params: [address],
      });
      console.log(keyB64)

      console.log(data)
      let encMsg = ''
      if (data.obj?.encrypted_data) {
        const encryptedList = data.obj?.encrypted_data
        encryptedList.forEach(e => {
          if (keyB64 in e) {
            console.log(e[keyB64]);
            encMsg = e[keyB64];
          }


        });
      }

      if (encMsg.length > 0) {
        const decryptedMessage = await ethereum.request({
          method: 'eth_decrypt',
          params: [encMsg, address],
        });
        console.log("decrypted: ", decryptedMessage);
        let newInsignias = insignias.map(e => {
          if (e.id == data.id) {
            return { ...e, data_desencrypted: decryptedMessage };
          } else {
            return { ...e }
          }
        })
        console.log(newInsignias)
        setInsignias(newInsignias)

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `No puedes ver la informacion porque no tienes permisos`
        })
      }

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.reason}`
      })

    }


  }

  const fetchdata = async (_listUris) => {
    const data = []
    try {
      for (const i of _listUris) {
        console.log(i)
        const response = await axios.get(i.uri);
        const obj = await response.data
        const id = i.id;
        data.push({
          id,
          obj
        });
      }

      setInsignias(data);
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const burn = async (e) => {
    console.log(searchAccount);
    console.log(e)
    try {
      const decimals = 6
      const re = await contract.valueOfInsignia(ethers.toNumber(e));
      const amnt = ethers.formatUnits(re, decimals)
      Swal.fire({
        title: `Do you want to transfer USDC ${amnt}`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        denyButtonText: `No`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */

        if (result.isConfirmed) {
          try {
            const tx = await contract.burn(e);
            await tx.wait();
            console.log(tx);
            Swal.fire('Confirmed!', `<a>${tx.hash}</a>`, 'success',)
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: `${error.reason}`
            })
            console.log(error.reason)
          }

        }
      })

    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.reason}`
      })
    }

  }

  const setAllowance = async () => {
    try {
      const amount = BigInt(10000 * 10 ** 6);
      const tx = await usdcContract.approve(await contract.getAddress(), amount);
      tx.wait();
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setSearchAccount(e.target.account.value)

  }




  useEffect(() => {
    if (!contract && !usdcContract) return;
    let mounted = true;

    const getInsignias = async (account) => {
      try {
        const response = await contract.balanceOf(account);
        console.log("OWNER OF:", ethers.toNumber(response));
        const cantInsignias = response
        let idList = [];
        const listUris = [];
        for (let index = 0; index < cantInsignias; index++) {
          let id = await contract.tokenOfOwnerByIndex(account, index);
          const uri = await contract.tokenURI(id);
          idList.push(ethers.toNumber(id));
          id = ethers.toNumber(id)
          listUris.push(
            { uri, id });
        }

        await fetchdata(listUris);


      } catch (error) {
        if (error.reason) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${error.reason}`
          })
        }
        console.log(error)
      }
    };

    const getUsdcBalance = async () => {
      const balanc = await usdcContract.balanceOf(address) ?? "";

      const usd = ethers.formatUnits(balanc, 6)
      setUsdcBalance(usd);
    }


    const element = ref.current;

    if (mounted) {

      if (searchAccount.length > 0) {

        getInsignias(searchAccount);
      }
      getUsdcBalance();

    }

    return () => {
      mounted = false;
    };
  }, [contract, usdcContract, searchAccount]);



  return (
    <>
      <div className="container mx-auto  px-32" >
        <div className="grid grid-cols-2 gap-4 m-4">
          <div className="col-start-1 col-end-3 ">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={connectWallet}
            >
              CONNECT como Verificador
            </button>
          </div>
          <div className="col-end-7 col-span-2 ">
            {isAuthenticated && (
              <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Connected</span>
            )}
          </div>

        </div>

      </div>
      <div className="container mx-12 px-8 mt-4">

        <h1 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center mx-8 px-3">Verificacion de Insignias</h1>

        <form class="flex items-center mx-32 my-4" onSubmit={onSubmit} >
          <label for="simple-search" class="sr-only">Buscar Insignias</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
              </svg>
            </div>
            <input
              pattern="^0x[a-fA-F0-9]{40}$"
              title="Debería ser una dirección Ethereum válida comenzando con 0x y seguido de 40 caracteres hexadecimales."
              name="account"
              type="text" id="account" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="0x0000 address" required />
          </div>
          <button ref={ref} type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </form>


        <div className="grid grid-cols-2 gap-4 mx-32 ">
          <button
            onClick={setAllowance}
            type="button"
            class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >Allowance USDC
          </button>

          <div className="text-center">
            <p className="text">BALANCE OF USDC:  $ {usdcBalance}</p>
          </div>

        </div>


        {(insignias.length == 0 && searchAccount.length > 0) && (
          <div className="px-32 my-24"> <p>NO SE ENCONTRARON RESULTADOS</p></div>
        )}

        <div class=" mx-12 px-8 mt-7 grid grid-cols-3 gap-2">

          {insignias.length > 0 && insignias.map(i => (

            <div key={i.id} className="">
              <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 ">
                <a href="#" className="flex justify-center items-center">
                  <img class="rounded-full w-80 h-80 m-2 " src={i.obj.image_uri ?? "https://gateway.pinata.cloud/ipfs/QmaZzxDPYSQMQArLzXB1iN76TY9AieedTujXQHG5hDkoJN"} alt="Imagen" />
                </a>
                <div class="p-5">
                  <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{i.obj.type}</h5>
                  </a>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">USDC {i.obj.value_amount}</p>
                  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> ID: {i.id}</p>
                  {i.data_desencrypted && (
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"> Data desencriptada: {i.data_desencrypted}</p>
                  )}


                  <div className="grid grid-cols-2 gap-2">
                    <a onClick={() => burn(i.id)} class="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Burn
                      <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                      </svg>
                    </a>
                    {i.obj?.encrypted_data?.length > 0 && (
                      <a onClick={() => dencrypt(i)} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Dencrypt
                        <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                      </a>
                    )}
                  </div>


                </div>
              </div>
            </div>

          ))}





        </div>

      </div>
    </>

  );
}