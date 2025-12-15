import React from "react";

function ToggleButton({ id, checked, onChange, disabled = false }) {
  return (
    <label
      htmlFor={id}
      className="relative inline-flex cursor-pointer items-center"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />

      <div
        className="
          h-6 w-11 rounded-full
          transition-colors duration-200

          /* FALSE (red) */
          bg-red-500 hover:bg-red-600

          after:absolute after:top-0.5 after:left-0.5
          after:h-5 after:w-5 after:rounded-full after:bg-white
          after:shadow after:transition-all after:content-['']

          /* TRUE (green) */
          peer-checked:bg-green-500 peer-checked:hover:bg-green-600
          peer-checked:after:translate-x-full

          peer-focus:ring-4 peer-focus:ring-green-200
          peer-disabled:cursor-not-allowed peer-disabled:opacity-50
        "
      />
    </label>
  );
}

export default ToggleButton;
