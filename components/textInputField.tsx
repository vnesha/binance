import { useState, useEffect } from "react";

interface textFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  componentName?: string;
  className?: string;
  label?: string;
  sufix?: string;
  prefix?: string;
  maxCharacters?: number;
  name?: string;
  type?: string;
}

export default function TextInputField({
  componentName,
  className,
  label,
  sufix,
  prefix,
  defaultValue,
  maxCharacters,
  type,
  ...props
}: textFieldProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");

  useEffect(() => {
    if (defaultValue) setInputValue(defaultValue.toString());
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (maxCharacters && event.target.value.length > maxCharacters) {
      return;
    }
    setInputValue(event.target.value);
  };
  const parsedInputValue = isNaN(Number(props.value)) ? 0 : Number(props.value);
  const inputClass =
    componentName === "rr" && parsedInputValue > 9 ? "w-[20px]" : "w-[13px]";

  const inputContainerClass = componentName ? "" : "w-full";

  return (
    <div
      className={`my-2 box-border flex h-10 flex-row items-center justify-between rounded bg-gray-middle px-2 text-sm hover:border-[1px] hover:border-yellow hover:px-[0.45rem] ${className}`}
    >
      <div
        className={`flex-grow select-none whitespace-nowrap text-gray-light`}
      >
        {label}
      </div>
      <div className="flex flex-row items-center">
        {prefix && (
          <span className="right-2 text-right text-gray-lighter">{prefix}</span>
        )}
        <input
          name={props.name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={props.onBlur}
          className={`m-0 border-0 bg-gray/0 p-0 pr-1 text-right text-sm text-gray-lighter caret-yellow focus:border-0 focus:ring-0 ${
            componentName ? inputClass : inputContainerClass
          }`}
          type={type}
          {...props}
        />
      </div>
      <div className="box-border select-none text-gray-lighter">{sufix}</div>
    </div>
  );
}
