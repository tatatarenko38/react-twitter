import { React, useState, useMemo, createContext } from "react";

import Page from "./component/page";

import PostList from "./container/post-list";

//контекст компонента(змінити колір кнопки(в компоненті field-form) при зміні теми)
export const THEME_TYPE = {
  LIGHT: "light",
  DARK: "dark",
};

//(null) - коли немає значень за замовчуванням
export const ThemeContext = createContext(null);

function App() {
  const [currentTheme, setTheme] = useState(THEME_TYPE.DARK);

  const handleChangeTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === THEME_TYPE.DARK) {
        return THEME_TYPE.LIGHT;
      } else {
        return THEME_TYPE.DARK;
      }
    });
  };

  //повертає об'єкт, який ми будемо оновлювати,
  //якщо [currentTheme] була змінена
  const theme = useMemo(
    () => ({ value: currentTheme, toggle: handleChangeTheme }),
    [currentTheme]
  );

  return (
    <Page>
      <ThemeContext.Provider value={theme}>
        <PostList theme={theme} />
      </ThemeContext.Provider>
    </Page>
  );
}
export default App;
