import "./index.css";

//класичні статуси, що будуть використ в контейнерах
//щоб відмічати статус відправки чи отримання данних
//та виводити відповідний Alert чи Loader чи Skeleton
export const LOAD_STATUS = {
  PROGRESS: "progress",
  SUCCESS: "success",
  ERROR: "error",
};

//карточка з бордером де виводиться текст
export function Alert({ message, status = "default" }) {
  return <div className={`alert alert--${status}`}>{message}</div>;
}

//анімована лінія загрузки
export function Loader() {
  return <div className="loader"></div>;
}

//анімовані блоки на місці яких будуть данні
//анімаційні карточки постів, які завантажуються
export function Skeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
    </div>
  );
}
