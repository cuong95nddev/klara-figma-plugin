import { useMemo, useState } from "react";

function useInputValue(initialValue: string | number | undefined = "") {
  const [value, setValue] = useState(initialValue);
  useMemo(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (value: string | number) => {
    setValue(value);
  };

  return {
    value,
    onChange: onChange,
  };
}

export default useInputValue;
