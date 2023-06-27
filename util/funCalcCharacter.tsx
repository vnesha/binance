"use client";
export function funCalcCharacter(event: any, livePrice: number, formik: any) {
  const value = event.target.value;
  const livePriceParts = livePrice.toString().split(".");
  const valueParts = value.split(".");
  if (
    (!valueParts[0] || valueParts[0].length <= livePriceParts[0].length) &&
    (!valueParts[1] || valueParts[1].length <= (livePriceParts[1] || "").length)
  ) {
    formik.setFieldValue("sl", value);
  }
}
