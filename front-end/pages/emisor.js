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

  const contract = useDigitalBadgeContract();

  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };


  const mint = async (_to, _uritoken, _is_transferable, _value) => {
    try {

      const response = await contract.safeMint(_to, _uritoken, _is_transferable, _value);
      console.log("TX HASH ".response.transactionHash)
      alert(`Successully  :  txHASH: ${response.transactionHash}`,)
      console.log("Response:", response);
    } catch (error) {
      console.log(error.reason)
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
     // getLastMessage();
    }

    return () => {
      mounted = false;
    };
  }, [contract]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //get data from the form

    // Read the form data
    const form = event.target;
    const formData = new FormData(form);
    formData.append("is_transferable", checked);
    const formJson = Object.fromEntries(formData.entries());
    const titularAddress = formJson.titular;
    const body = {
      ...formJson,
      value_amount: form.value_amount
    }
    const endpoint = "/api/emision";
    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(formJson),
    };
    const value = formJson.value_amount

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    console.log(response)
    const result = await response.json();
    try {
      if (response.status == 200 && String(result.uritoken).length > 0) {
        alert(`HASH CID  ${result?.uritoken}`);
        const tx = await contract.safeMint(titularAddress, result.uritoken, checked,value)
        const res = await tx.wait()
        console.log("TX HASH ", res.hash)
        alert(`Successully  :  txHASH: ${res.hash}`,)
        console.log("Response:", res);

      } else if (response.status == 400) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }

    } catch (error) {
      alert(`ERROR  : ${error.reason}`,)
      console.log(error.reason)

    }


  }

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
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Address TITULAR
            </label>
            <input
              name="titular"
              type="text"
              id="titular"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0x00000"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Valor de la insignia en USDC
            </label>
            <input
              name="value_amount"
              type="text"
              id="value_amount"
              pattern="[0-9]*"
              title="Solo se permiten números."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1000"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tipo de Insignia
            </label>
            <select
              name="type"
              id="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            >
              <option selected>Choose an option</option>
              <option value="Liberacion de CTS">Liberacion de CTS</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="banco"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Banco titular
            </label>
            <select
              name="banco"
              id="banco"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            >
              <option selected>Choose an option</option>
              <option value="BBVA">BBVA</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="empresa"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre de empresa
            </label>
            <input
              type="text"
              id="empresa"
              name="empresa"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Mi empresa"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="ruc"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              RUC de la EMPRESA
            </label>
            <input
              type="ruc"
              id="ruc"
              name="ruc"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="2099809...."
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="expiration_date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fecha de Expiracion de la Insignia
            </label>
            <input
              type="date"
              id="expiration_date"
              name="expiration_date"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="09/09/2023"
              required
            />
          </div>

          <div className="flex items-start mb-6">
            <div className="flex items-center h-5">
              <input
                id="is_transferable"
                name="is_transferable"
                type="checkbox"
                value={checked}
                onChange={handleCheckboxChange}
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"

              />
            </div>
            <label
              htmlFor="is_transferable"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              La insignia es transferible?
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"

          >
            EMITIR
          </button>
        </form>
      </div>
    </div>
  );
}
