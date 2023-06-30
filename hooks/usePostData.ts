import { API_KEY, SECRET_KEY } from "@/util/cryptoConfig";
import generateSignature from "@/util/cryptoUtils";

export function postData(params: Record<string, any>) {
  const query = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

  const signature = generateSignature(query, SECRET_KEY);

  const config = {
    headers: {
      "X-MBX-APIKEY": API_KEY,
    },
    params: {
      ...params,
      signature: signature,
    },
  };

  return config;
}