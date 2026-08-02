import type { InputHTMLAttributes } from "react";
import cls from "./Input.module.css";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: string | boolean;
}

const Input = (props: Props) => {
  const { labelText, error, className, name, ...rest } = props;

  const inputClasses = [cls.Input, error ? cls.errorInput : "", className].join(
    " ",
  );

  return (
    <div className={cls.InputGroup}>
      {labelText && (
        <label htmlFor={name} className={cls.Label}>
          {labelText}
        </label>
      )}
      <input name={name} id={name} className={inputClasses} {...rest} />
      {typeof error === "string" && (
        <span className={cls.errorMessage}>{error}</span>
      )}
    </div>
  );
};

export default Input;
