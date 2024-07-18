import { useState, memo, useContext } from "react";

import "./index.css";
import { ThemeContext } from "../../App";

//оптимізація через memo
function Component({ placeholder, button, onSubmit }) {
  // відповідає за значення в полі
  const [value, setValue] = useState("");

  //для задавання значення
  const handleChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    //якщо значення нема то 0
    if (value.length === 0) return null;

    //якщо є - передаємо його в onSubmit
    if (onSubmit) {
      onSubmit(value);
    } else {
      throw new Error("onSubmit props is undefined");
    }

    //робимо поле - пустий рядок без значення
    setValue("");
  };
  //генерується в моменті щоб вказати активна кнопка чи ні
  const isDisabled = value.length === 0;

  //контекст компонента(змінити колір кнопки(код з App.js) при зміні теми)
  // useContext

  const theme = useContext(ThemeContext);
  console.log(theme);

  return (
    <div className="field-form">
      <textarea
        onChange={handleChange}
        value={value}
        // textarea має 2 рядка
        rows={2}
        placeholder={placeholder}
        className="field-form__field"
      ></textarea>
      <button
        disabled={isDisabled}
        onClick={handleSubmit}
        className="field-form__button"
      >
        {button}
      </button>

      {/* кнопка при зміні теми */}
      <button onClick={theme.toggle} className="field-form__button">
        Change theme
      </button>
    </div>
  );
}

export default memo(Component);
