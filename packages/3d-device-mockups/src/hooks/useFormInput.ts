import { useMemo, useState } from "react";

function useFormInput(initialValue: string | number | undefined = "") {
  const [value, setValue] = useState(initialValue);
  useMemo(() => setValue(initialValue), [initialValue]);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  return {
    value,
    onChange: handleChange,
  };
}

export default useFormInput;
