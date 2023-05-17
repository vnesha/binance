import axios from "axios";
import { getQueryString, API_KEY, SECRET_KEY } from "../../util/cryptoConfig";
import generateSignature from "../../util/cryptoUtils";
;

export async function fetchData(url: string) {
  const queryString = await getQueryString();
  const signature = generateSignature(queryString, SECRET_KEY);
  
  const { data } = await axios.get(
    `${url}?${queryString}&signature=${signature}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-MBX-APIKEY": API_KEY,
      },
    }
  );

  return data;
}