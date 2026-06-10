import type { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import cls from "./Button.module.css";

type Props<T extends ElementType = "button"> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

function Button<T extends ElementType = "button">(props: Props<T>) {
  const { as, children, ...otherProps } = props;
  const Component = as ?? "button";

  return (
    <Component className={cls.Button} {...otherProps}>
      {children}
    </Component>
  );
}

export default Button;
