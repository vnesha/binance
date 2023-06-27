export function formatNumber(
  number: number | string | null | undefined,
  symbol: string | undefined,
  isBaseAsset: boolean,
  precision: number | undefined | null,
  options: { showPlusSign?: boolean, customSuffix?: string } = {}
) {
  const { showPlusSign = false, customSuffix = "" } = options;

  const parsedNumber = number 
    ? typeof number === "string" 
      ? parseFloat(number) 
      : number 
    : 0;  // pretpostavimo 0 ako je broj null ili undefined

  const formattedNumber = parsedNumber.toLocaleString("en-US", {
    minimumFractionDigits: precision ?? 0, // pretpostavimo 0 ako je preciznost null ili undefined
    maximumFractionDigits: precision ?? 0, // pretpostavimo 0 ako je preciznost null ili undefined
  });

  const suffix = customSuffix || (isBaseAsset ? symbol ?? "" : ""); // pretpostavimo prazan string ako je simbol undefined

  const spaceAfterNumber = customSuffix === "" ? " " : "";

  if (parsedNumber > 0) {
    return `${showPlusSign ? "+" : ""}${formattedNumber}${spaceAfterNumber}${suffix}`;
  } else {
    return `${formattedNumber}${spaceAfterNumber}${suffix}`;
  }
}

export function addTextClass(number: number) {
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

export function addBgClass(number: number) {
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

export function addTextClassSide(string: string) {

  if (string == "BUY") {
    return "text-green";
   } else {
    return "text-red";
  }
}

export const formatLocale = (number: number | null): string => {
  if (number === null) {
    return "0.00 USDT";
  }
  const stringNumber = String(number); // pretvara broj u string
  const backToNumber = parseFloat(stringNumber); // pretvara string nazad u broj
  return backToNumber.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " USDT";
};

export const formatLocaleSufix = (number: number | null, asset: string): string => {
  if (number === null) {
    return `0.00 ${asset}`;
  }
  const stringNumber = String(number); // pretvara broj u string
  const backToNumber = parseFloat(stringNumber); // pretvara string nazad u broj
  return `${backToNumber.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${asset}`;
};

  