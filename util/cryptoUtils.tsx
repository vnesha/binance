const cryptosha256 = require("crypto");

export default function generateSignature(
  queryString: string,
  SECRET_KEY: string
) {
  return cryptosha256
    .createHmac("sha256", SECRET_KEY)
    .update(queryString)
    .digest("hex");
}
