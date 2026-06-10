import cls from "./EmptyState.module.css";

const EmptyState = () => {
  return (
    <div className={cls.emptyState}>
      <div className={cls.emptyContent}>
        <span className={cls.simpleIcon}>✨</span>
        <p>Напишите что-нибудь, чтобы начать поиск аналогов</p>
      </div>
    </div>
  );
};

export default EmptyState;
