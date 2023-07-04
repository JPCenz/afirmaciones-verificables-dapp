import { useMemo, useState } from "react";
import { useWeb3Context } from "@/context/web3Context";
import useDigitalBadgeContract from "@/hooks/useBadgeContract";
import { useEffect } from "react";
export default function Emisor() {
  const {
    connectWallet,
    disconnect,
    state: { isAuthenticated, address, currentChain, provider },
  } = useWeb3Context();
  console.log(provider);

  const contract = useDigitalBadgeContract();

  const mint = async () => {
    try {
      const wallet = "0xB1F6d2B76AF9A8392205f1d1cE1E418ac3843533"
      const response = await contract.safeMint(wallet, "www.youtube.com", true);

      console.log("Response:", response);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!contract) return;
    let mounted = true;

    const getLastMessage = async () => {
      try {

        const response = await contract.tokenURI(0);

        console.log("OWNER OF:", response);
      } catch { }
    };




    if (mounted) {
      getLastMessage();
    }

    return () => {
      mounted = false;
    };
  }, [contract]);

  return (
    <div>
      
      <div className="container mx-auto px-8">
      <h1 className="m-4 ">EMISION DE INSIGNIAS </h1>
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={connectWallet}
        >
          CONNECT como emisor
        </button>
      </div>


      <div className="container mx-auto px-8">
        <form>
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Address TITULAR
            </label>
            <input
              type="text"
              id="titular"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0x00000"
              required
            />
          </div>

          <div class="mb-6">
            <label
              for="countries_disabled"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tipo de Insignia
            </label>
            <select
              id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose an option</option>
              <option value="Liberacion de CTS">Liberacion de CTS</option>
            </select>
          </div>

          <div class="mb-6">
            <label
              for="countries_disabled"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Banco titular
            </label>
            <select
              id="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose an option</option>
              <option value="BBVA">BBVA</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre de empresa
            </label>
            <input
              type="text"
              id="titular"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Mi empresa"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              RUC de la EMPRESA
            </label>
            <input
              type="text"
              id="titular"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="2099809...."
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fecha de Expiracion de la Insignia
            </label>
            <input
              type="text"
              id="titular"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="09/09/2023"
              required
            />
          </div>

          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                required
              ></input>
            </div>
            <label
              for="remember"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              La insignia es transferible?
            </label>
          </div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={mint}
          >
            EMITIR
          </button>
        </form>
      </div>
    </div>
  );
}
