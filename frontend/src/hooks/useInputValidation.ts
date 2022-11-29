import React, { useState } from 'react';

export default function useInputValidation(
  callback: (value: string) => boolean,
  initialValue: string,
): [(e: React.ChangeEvent<HTMLInputElement>) => void, boolean] {
  const [isValidated, setIsValidated] = useState(callback(initialValue));
  const validateInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setIsValidated(callback(value));
  };
  return [validateInputValue, isValidated];
}
