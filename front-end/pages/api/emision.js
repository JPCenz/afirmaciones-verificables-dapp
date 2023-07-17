import axios from "axios";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Only POST requests are allowed.",
    });
  }

  try {
    const body = req.body;
    const {
      empresa,
      expiration_date,
      is_transferable,
      ruc,
      titular,
      type,
      banco,
    } = body;
    ;


    let image_uri;
    const uriAutotask = "https://api.defender.openzeppelin.com/autotasks/1d012b6d-8174-4ea5-aa62-7e43f5f99a04/runs/webhook/59be5e91-70a1-470d-8960-c450d375f7fb/" + process.env.KEY_AUTOTASK;
    const resimage = await axios.post(
      uriAutotask

    )

    if (resimage.data?.result) {
      image_uri = JSON.parse(resimage.data.result).url
    } else {
      return res.status(500).json({ error: "se produjo un error Autotask" })
    }
    let actualDate = new Date(); 
    let issuance_date = actualDate.toISOString().slice(0, 10); // convierte la fecha a formato ISO y luego toma sólo la parte de la fecha

    let encrypted_data = [
      {
        "04a349b7a07a547bb027984d832c1eb42f581a1b0dc1b46a3e6b94f20058d387778b8a8d5441bd0b0a9248d1c56653c8d44be758cd132091fcacd2f59a42899fee":"data encrypted"
      },
    
    ]

    const newBody = {
      ...body,
      issuance_date,
      encrypted_data,
      value_amount: parseInt(body.value_amount),
      is_transferable: Boolean(is_transferable),
      image_uri
    }




    console.log(JSON.stringify(newBody));
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { pinataContent: newBody },
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.JWT_PINATA,
        },
      }
    );
    const uritoken = `https://ipfs.io/ipfs/${response.data?.IpfsHash}`;
    console.log(uritoken);

    return res.status(200).json({ uritoken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}
