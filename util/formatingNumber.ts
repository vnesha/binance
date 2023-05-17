export function formatNumber(
  number: number | string,
  symbol: string,
  isBaseAsset: boolean,
  precision: number | undefined,
  options: { showPlusSign?: boolean, customSuffix?: string } = {}
) {
  const { showPlusSign = false, customSuffix = "" } = options;

  const parsedNumber = typeof number === "string" ? parseFloat(number) : number;

  const formattedNumber = parsedNumber.toLocaleString("en-US", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  const suffix = customSuffix || (isBaseAsset ? symbol : "");

  const spaceAfterNumber = customSuffix === "" ? " " : "";

  if (parsedNumber > 0) {
    return `${showPlusSign ? "+" : ""}${formattedNumber}${spaceAfterNumber}${suffix}`;
  } else {
    return `${formattedNumber}${spaceAfterNumber}${suffix}`;
  }
}

export function addTextClass(number) {
  let parsedNumber;

  // Provera da li je number string koji se može pretvoriti u broj
  if (typeof number === "string") {
    parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber)) {
      console.error(`getNumberClass error: '${number}' is not a number.`);
      return "";
    }
  } else if (typeof number === "number") {
    parsedNumber = number;
  } else {
    console.error(`getNumberClass error: '${number}' is not a number.`);
    return "";
  }

  if (parsedNumber > 0) {
    return "text-green";
  } else if (parsedNumber < 0) {
    return "text-red";
  } else {
    return "";
  }
}

export function addBgClass(number) {
  let parsedNumber;

  // Provera da li je number string koji se može pretvoriti u broj
  if (typeof number === "string") {
    parsedNumber = parseFloat(number);
    if (isNaN(parsedNumber)) {
      console.error(`getNumberClass error: '${number}' is not a number.`);
      return "";
    }
  } else if (typeof number === "number") {
    parsedNumber = number;
  } else {
    console.error(`getNumberClass error: '${number}' is not a number.`);
    return "";
  }

  if (parsedNumber > 0) {
    return "bg-green";
  } else if (parsedNumber < 0) {
    return "bg-red";
  } else {
    return "";
  }
}

  