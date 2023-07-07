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
    const uriAutotask = "https://api.defender.openzeppelin.com/autotasks/1d012b6d-8174-4ea5-aa62-7e43f5f99a04/runs/webhook/59be5e91-70a1-470d-8960-c450d375f7fb/"+process.env.KEY_AUTOTASK;
    const resimage = await axios.post(
      uriAutotask
      
    )

    if (resimage.data?.result) {
      image_uri = JSON.parse(resimage.data.result).url
    } else{
      return res.status(500).json({ error: "se produjo un error Autotask" })
    }
    
    const newBody= {
      ...body,
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
