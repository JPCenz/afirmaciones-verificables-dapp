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
    
    
    const newBody= {
      ...body,
      value_amount: parseInt(body.value_amount),
      is_transferable: Boolean(is_transferable),
      image_uri: "https://ipfs.io/ipfs/QmWU4yb225aTpyWkBQKAffjLaPhFKyWYiiPKbUvJPx6eou/0.png"
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
