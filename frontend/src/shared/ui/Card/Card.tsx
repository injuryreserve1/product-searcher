import type { ReactNode } from "react";
import cls from "./Card.module.css";

interface Props {
  children: ReactNode;
  title?: string;
}

const Card = ({ children, title }: Props) => {
  return (
    <div className={cls.Wrapper}>
      <main className={cls.Main}>
        <h1 className={cls.Title}>{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default Card;
