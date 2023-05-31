import { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { OpenOrder } from "@/components/buttonOpenOrder";
import { useOpenOrder } from "@/app/hooks/useOpenOrder";
import { usePositionData } from "@/app/hooks/usePositionData";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  selectedSymbol: Yup.string().required("Required"),
  quantity: Yup.number()
    .positive("Must be a positive number")
    .moreThan(0, "Minimum quantity is 0.001 BTC"),
});

export const OrderForm = ({
  perpetualSymbols,
  baseAssetAll,
}: {
  perpetualSymbols: string[];
  baseAssetAll: string[];
}) => {
  const openMarkOrderMutation = useOpenOrder();
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [hasClickedBuy, setHasClickedBuy] = useState(false);
  const [hasLostFocus, setHasLostFocus] = useState(false);
  const { combinedData } = usePositionData();
  const quoteAsset = combinedData.map((item) => item.quoteAsset);
  const [selectedAsset, setSelectedAsset] = useState("");
  //const quoteAssetAll = [...new Set(quoteAsset)];

  const formik = useFormik({
    initialValues: {
      selectedSymbol: "",
      quantity: "",
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: hasStartedTyping,
    onSubmit: async (values, { setSubmitting }) => {
      setHasClickedBuy(true);
      if (values.quantity === "") {
        setHasStartedTyping(true);
        formik.setFieldTouched("quantity", true, false);
      } else if (parseFloat(values.quantity) > 0) {
        await openMarkOrderMutation.mutateAsync({
          symbol: values.selectedSymbol,
          quantity: parseFloat(values.quantity),
        });
        setHasClickedBuy(false);
        setHasStartedTyping(false);
        setHasLostFocus(false);
      }
      setSubmitting(false);
    },
  });

  const symbolWithoutUSDT = formik.values.selectedSymbol.replace(
    `${quoteAsset}`,
    ""
  );
  const baseAsset = baseAssetAll.includes(symbolWithoutUSDT)
    ? symbolWithoutUSDT
    : "";

  useEffect(() => {
    if (perpetualSymbols.length > 0) {
      formik.setFieldValue("selectedSymbol", perpetualSymbols[0]);
    }
  }, [perpetualSymbols]);

  useEffect(() => {
    if (formik.values.quantity !== "" && hasStartedTyping) {
      formik.setFieldTouched("quantity", true);
    }
  }, [formik.values.quantity, hasStartedTyping]);

  return (
    <div className="w-[255px] bg-black px-4">
      <form onSubmit={formik.handleSubmit}>
        <label className="text-sm">
          Select a symbol:
          <select
            className="h-10 w-full rounded border-0 bg-gray-middle text-sm focus:ring-0"
            name="selectedSymbol"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.selectedSymbol}
          >
            {perpetualSymbols.map((symbol: string) => (
              <option value={symbol} key={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span
            className={`text-sm ${
              formik.touched.quantity && formik.errors.quantity
                ? "text-red"
                : ""
            }`}
          >
            {formik.touched.quantity && formik.errors.quantity
              ? formik.errors.quantity
              : "Enter quantity:"}
          </span>
        </label>
        <div
          onClick={() => {
            if (hasStartedTyping) {
              formik.setFieldTouched("quantity");
            }
          }}
          className={`quantity-field - relative m-[1px] my-2 box-border inline-flex h-10 w-full items-center rounded bg-gray-middle text-sm hover:border hover:border-yellow ${
            (formik.values.quantity === "" && hasClickedBuy) ||
            (parseFloat(formik.values.quantity) === 0 &&
              formik.touched.quantity)
              ? "border-[1px] border-red hover:border hover:border-red "
              : formik.touched.quantity ||
                (hasLostFocus && formik.errors.quantity)
              ? "border-[1px] border-yellow "
              : ""
          }`}
        >
          <div>
            <label className="ml-2 flex flex-shrink-0">Size</label>
          </div>
          <input
            className="m-0 h-10 w-full border-0 bg-gray-middle/0 px-1 py-0 text-right text-sm focus:border-0 focus:ring-0"
            type="text"
            name="quantity"
            onChange={(e) => {
              if (e.target.value.length > 5) {
                return;
              }
              if (e.target.value !== "" && !hasStartedTyping) {
                setHasStartedTyping(true);
              }
              formik.handleChange(e);
            }}
            onBlur={() => {
              formik.handleBlur("quantity");
              if (!formik.errors.quantity) {
                formik.setFieldTouched("quantity", false, false);
                setHasLostFocus(true);
              }
            }}
            onFocus={() => {
              if (!formik.touched.quantity) {
                formik.setFieldTouched("quantity", true, false);
              }
            }}
            onKeyDown={(e) => e.key === "-" && e.preventDefault()}
            value={formik.values.quantity === "" ? "" : formik.values.quantity}
          />
          <div>
            <label className="flex flex-shrink-0 text-right text-sm text-gray-lighter">
              <select
                className="border-0 bg-gray-middle/0 text-right text-sm outline-none focus:ring-0"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              >
                <option value={baseAsset}>{baseAsset}</option>
                <option value={quoteAsset}>{quoteAsset}</option>
              </select>
            </label>
          </div>
        </div>
        <OpenOrder
          isFormValid={formik.isValid && formik.dirty}
          isSubmitting={formik.isSubmitting}
        />
      </form>
    </div>
  );
};
