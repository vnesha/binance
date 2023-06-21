interface textFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  sufix?: string;
}

export default function TextInputField({
  className,
  label,
  sufix,
  ...props
}: textFieldProps) {
  return (
    <div
      className={`my-2 box-border flex h-10 flex-row items-center justify-between rounded bg-gray-middle px-2 text-sm hover:border-[1px] hover:border-yellow hover:px-[0.45rem] ${className}`}
    >
      <div className="flex-grow select-none whitespace-nowrap text-gray-light">
        {label}
      </div>
      <input
        className="m-0 box-border w-full flex-shrink border-0 bg-gray/0 pr-1 text-right text-sm text-gray-lighter caret-yellow focus:border-0 focus:ring-0"
        type="text"
        {...props}
      ></input>

      <div className="box-border  select-none text-gray-lighter">{sufix}</div>
    </div>
  );
}
