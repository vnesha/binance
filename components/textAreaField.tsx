import { useState, useEffect } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  defaultValue?: string;
  maxCharacters?: number;
  name?: string;
  disabled?: boolean;
}

export default function TextArea({
  className,
  label,
  defaultValue,
  maxCharacters,
  disabled = false,
  ...props
}: TextAreaProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");

  useEffect(() => {
    if (defaultValue) setInputValue(defaultValue.toString());
  }, [defaultValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxCharacters && event.target.value.length > maxCharacters) {
      return;
    }
    setInputValue(event.target.value);
  };

  return (
    <div
      className={`my-1 rounded ${className} ${
        disabled ? "bg-gray/40" : "bg-gray-middle"
      }`}
    >
      {label && (
        <div
          className={`pl-2 pt-2 text-sm text-gray-light ${
            disabled ? "text-gray-light/40" : "text-gray-light"
          }`}
        >
          {label}
        </div>
      )}
      <textarea
        name={props.name}
        value={inputValue}
        onChange={handleInputChange}
        className={`h-[32px] w-full overflow-y-hidden border-0 bg-gray/0 p-2 text-sm text-gray-lighter caret-yellow focus:border-0 focus:ring-0 ${
          disabled ? "cursor-default text-gray-lighter/20" : ""
        }`}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
