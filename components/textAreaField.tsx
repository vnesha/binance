"use client";
import { useState, useEffect, useRef, ChangeEvent } from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label?: string;
  defaultValue?: string;
  maxCharacters?: number;
  name?: string;
  disabled?: boolean;
  extraText?: string;
  onExtraTextClick?: () => void;
  handleSelectSymbol?: (symbol: string) => void; // Promenjeno ime propa
}

export default function TextArea({
  className,
  label,
  defaultValue,
  maxCharacters,
  name,
  disabled = false,
  extraText = "",
  onExtraTextClick,
  handleSelectSymbol, // Promenjeno ime propa
  ...props
}: TextAreaProps) {
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (defaultValue) setInputValue(defaultValue.toString());
  }, [defaultValue]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "32px";
    }
  }, [name]);

  useEffect(() => {
    if (textAreaRef.current && name) {
      textAreaRef.current.style.height = "32px";
    }
  }, [name, props.value]);

  useEffect(() => {
    if (textAreaRef.current && name && inputValue === "") {
      textAreaRef.current.style.height = "32px";
    }
  }, [name, inputValue]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (maxCharacters && event.target.value.length > maxCharacters) {
      return;
    }
    setInputValue(event.target.value);

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }

    if (handleSelectSymbol) {
      handleSelectSymbol(event.target.value);
    }
  };

  return (
    <div
      className={`relative my-1 rounded ${className} ${
        disabled ? "bg-gray/40" : "bg-gray-middle"
      }`}
    >
      <div className="flex items-baseline justify-between pt-2">
        {label && (
          <div
            className={`pl-2 text-sm text-gray-light ${
              disabled ? "text-gray-light/40" : "text-gray-light"
            }`}
          >
            {label}
          </div>
        )}
        {onExtraTextClick && (
          <div
            className={`pr-2 text-sm ${
              disabled
                ? "cursor-default text-yellow/20"
                : "cursor-pointer text-yellow"
            }`}
            onClick={disabled ? undefined : onExtraTextClick}
          >
            {extraText}
          </div>
        )}
      </div>
      <textarea
        ref={textAreaRef}
        name={name}
        value={inputValue}
        onChange={handleChange}
        className={`w-full border-0 bg-gray/0 p-2 text-sm text-gray-lighter caret-yellow focus:border-0 focus:ring-0 ${
          disabled ? "cursor-default resize-none text-gray-lighter/20" : ""
        }`}
        disabled={disabled}
        {...props}
        style={{
          overflow: "hidden",
          resize: "none",
          minHeight: "32px",
          height: textAreaRef.current
            ? `${textAreaRef.current.scrollHeight}px`
            : "auto",
        }}
      />
    </div>
  );
}
