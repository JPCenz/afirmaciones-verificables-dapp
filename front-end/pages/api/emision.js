import axios from "axios";
import { encrypt } from '@metamask/eth-sig-util';

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
      data_to_encrypt
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

    
    let encrypted_data = [];

    let publicKeyList = ['IRx9CJ4X8wAWiFzkQe6c0ih2Ts4ei3ujD+3LiKLguAE=','o/+Q/PSv4GYLHmO32yADEWwx/z+kMCrX1ID/xsO7YzA=','MxfHSm2KmaDYtXhSm2+hi7FC2yJcK8BFDEYzxrbkqQo='];
    if (data_to_encrypt) {
      const VERSION = 'x25519-xsalsa20-poly1305'
      publicKeyList.forEach(pk => {
        const enc =  encrypt({
          publicKey: pk,
          data: data_to_encrypt,
          version: VERSION,
        });

        console.log(pk)
        const obj = {
        }
        

        const ct = `0x${Buffer.from(JSON.stringify(enc), 'utf8').toString('hex')}`;
        obj[pk] = ct
        encrypted_data.push(
          obj
          )
      });
      
    }





    delete body.data_to_encrypt

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
