import { useState, useReducer, memo, useCallback } from "react";

import "./index.css";

import FieldForm from "../../component/field-form";
import Grid from "../../component/grid";

import { Alert, Loader, LOAD_STATUS } from "../../component/load";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

function Container({ onCreate, placeholder, button, id = null }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  // оптимізація через useCallback
  //буде перерендер, коли [id] зміниться
  const convertData = useCallback(
    ({ value }) =>
      JSON.stringify({
        text: value,
        username: "user",
        postId: id,
      }),
    [id]
  );

  // оптимізація через useCallback
  //буде перерендер, коли[convertData, onCreate] зміняться
  const sendData = useCallback(
    async (dataToSend) => {
      //показати що починається завантаження нашого запиту на сервер
      dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
        const res = await fetch("http://localhost:4000/post-create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: convertData(dataToSend),
        });

        //логіка відправки данних
        //dataToSend це { value }
        // заімпортувати потрібні компоненти з компонента load

        //

        const data = await res.json();

        // якщо запит успішний - далі не потрібно
        //ставити success - треба просто відкатитися до
        //статусу за замовч = null- де ми взагалі ще нічого
        //не робили
        if (res.ok) {
          dispatch({ type: REQUEST_ACTION_TYPE.RESET });

          //буде виконуватись пропс onCreate(приходить з post-list),
          // який містить getData - завантажує список постів
          // тобто якщо пост створений, то список постів
          //буде оновлюватись і ми будем бачити наш
          //новий пост
          if (onCreate) onCreate();
        } else {
          //якщо помилка
          dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: data.message });
        }
      } catch (error) {
        dispatch({ type: REQUEST_ACTION_TYPE.ERROR, message: error.message });
      }
    },
    [convertData, onCreate]
  );

  // оптимізація через useCallback
  //буде перерендер, коли[sendData] зміниться
  const handleSubmit = useCallback(
    (value) => {
      return sendData({ value });
    },
    [sendData]
  );

  return (
    <Grid>
      <FieldForm
        placeholder={placeholder}
        button={button}
        onSubmit={handleSubmit}
      />

      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}

      {state.status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  );
}

export default memo(Container, (prev, next) => {
  //console.log(prev, next);

  // щоб не відбувався перерендер(в нас пропси не змінюються)
  return true;
});
