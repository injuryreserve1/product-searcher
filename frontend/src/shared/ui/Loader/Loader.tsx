import cls from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={cls.loaderOverlay}>
      <div className={cls.spinner}></div>
      {/* <p>Ищем лучшие аналоги...</p> */}
    </div>
  );
};

export default Loader;
