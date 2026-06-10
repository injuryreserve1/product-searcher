import type { InputHTMLAttributes } from "react";
import cls from "./Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: string | boolean;
}

const Input = (props: Props) => {
  const { labelText, error, className, ...rest } = props;

  const inputClasses = [cls.Input, error ? cls.errorInput : "", className].join(
    " ",
  );

  return (
    <div className={cls.InputGroup}>
      {labelText && <label className={cls.Label}>{labelText}</label>}
      <input className={inputClasses} {...rest} />
      {typeof error === "string" && (
        <span className={cls.errorMessage}>{error}</span>
      )}
    </div>
  );
};

export default Input;
