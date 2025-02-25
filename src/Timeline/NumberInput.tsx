import { useEffect, useRef, useState } from "react";

const DEFAULT_STEP = 10;

type NumberInputProps = {
  dataTestId: string;
  min: number;
  max: number;
  label: string;
  labelPosition?: "before" | "after";
  step?: number;
  value: number;
  defaultValue?: number;
  onChange: (value: number) => void;
};

export const NumberInput = ({
  dataTestId,
  min,
  max,
  label,
  labelPosition = "before",
  step = DEFAULT_STEP,
  value,
  defaultValue,
  onChange,
}: NumberInputProps) => {
  // using this state for storing the input value internally until the user decides to confirm the change
  const [inputValue, setInputValue] = useState<string>(value?.toString() || defaultValue?.toString() || "0");
  const inputRef = useRef<HTMLInputElement>(null);
  const isEscapingRef = useRef(false);

  const inputMin = Math.max(0, min);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  // this function is used to select the input text when the user clicks on the input or manually triggering it
  const triggerSelectInput = () => {
    requestAnimationFrame(() => inputRef.current?.select());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.round(Number(e.target.value.replace(/^0+/, "")));
    if (isNaN(val)) {
      val = Number(value);
    }
    // claculate the difference between the current value and the new value
    const valDiff = Math.abs(val - Number(inputValue));

    // if the difference is equal to the step (meaning we used the native arrow buttons), then update the value
    if (valDiff === step) {
      onChange(val);
      triggerSelectInput();
    }

    setInputValue(val.toString());
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleBlur = () => {
    // if the user is escaping the input, then don't update the value
    if (isEscapingRef.current) {
      isEscapingRef.current = false;
      return;
    }

    const val = Math.min(max, Math.max(inputMin, Number(inputValue)));
    setInputValue(val.toString());
    onChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      // no need to trigger the native onChange event
      e.preventDefault();

      const stepValue = e.key === "ArrowUp" ? step : -step;
      // calculate the new value based on the direction (up or down), and is multiples of step value
      let newValue = Number(inputValue) + Number(stepValue);
      if (newValue < inputMin) {
        newValue = inputMin;
      }
      if (newValue > max) {
        newValue = max;
      }

      setInputValue(newValue.toString());
      onChange(newValue);
      triggerSelectInput();
    } else if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setInputValue(value.toString());
      onChange(Number(value));

      // saving the escape event into a ref
      isEscapingRef.current = true;
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {labelPosition === "before" && <span>{label}</span>}
      <input
        ref={inputRef}
        type="number"
        data-testid={dataTestId}
        className="bg-gray-700 px-1 rounded"
        value={inputValue}
        min={inputMin}
        max={max}
        step={step}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {labelPosition === "after" && <span>{label}</span>}
    </>
  );
};
