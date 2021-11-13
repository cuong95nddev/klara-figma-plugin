import { useMemo, useRef, useState } from "react";

function useFormInput(initialValue: string | number | undefined = "") {
  const [value, setValue] = useState(initialValue);
  useMemo(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  const handleChange = (value: string | number) => {
    setValue(value);
  };

  return {
    value,
    onChange: handleChange,
  };
}

export default useFormInput;
