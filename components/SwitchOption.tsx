"use client";
import { Switch } from "@/components/ui/switch";

export function SwitchOption({
  checked,
  onCheckedChange,
  name,
  disabled = false,
  className,
}: {
  checked: boolean;
  onCheckedChange: any;
  name: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-row items-center justify-between p-1 text-sm text-gray-lighter ${className} ${
        disabled ? "cursor-default text-gray-lighter/50 opacity-40" : ""
      }`}
    >
      <div>{name}</div>
      <div className="flex items-center">
        <Switch
          disabled={disabled}
          checked={checked}
          onCheckedChange={onCheckedChange}
        />{" "}
      </div>
    </div>
  );
}
