import Title from "../../component/title";
import Grid from "../../component/grid";
import Box from "../../component/box";

import PostCreate from "../post-create";
import { Fragment, useEffect, useReducer } from "react";
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
import PostItem from "../post-item";

import { getDate } from "../../util/getDate";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

export default function Container() {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);
  //завантажує список постів в контейнері post-list
  const getData = async () => {
    // перевірити чи спрацьовує onCreate
    // alert(true);

    //аналогічно як в post-create
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
    try {
      //робимо запит - за замовч завжди {method: "GET"}
      const res = await fetch("http://localhost:4000/post-list");

      //отримаємо данні
      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        //якщо ромилка
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: data.message,
        });
      }
      //якщо технічна помилка в коді
    } catch (error) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  };

  // raw - сирий об'єкт з данними - ті, які ми відправляємо в ендпоїнті
  //там є лише list, тому створюється новий об'єкт з властивістю
  // list - в якому звертаємся до raw.list
  // map(({ id, username, text, date }) - витягуємо данні і передаємо
  const convertData = (raw) => ({
    list: raw.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date: getDate(date),
    })),
    // технічна властивість - щоб було true або false -
    //і можна було звернутися
    isEmpty: raw.list.length === 0,
  });

  //Використання хук ефекту компонента
  // [] - означає, що getData() буде спрацьовувати лише один раз
  //коли ми виконуємо перший рендер компонента
  useEffect(() => {
    //перевірити чи працює
    //alert("render");
    getData();
    // для автоматичного оновлення постів
    //const intervalId = setInterval(() => getData(), 5000);

    // функція очищення
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);

  // if (status === null) {
  //   getData();
  // }

  return (
    <Grid>
      <Box>
        <Grid>
          <Title>Home</Title>
          <PostCreate
            onCreate={getData}
            placeholder="What is happening?!"
            button="Post"
          />
        </Grid>
      </Box>

      {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
        <Fragment>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </Fragment>
      )}

      {state.status === REQUEST_ACTION_TYPE.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}

      {/* список постів */}
      {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
        <Fragment>
          {state.data.isEmpty ? (
            <Alert message="Список постів пустий" />
          ) : (
            state.data.list.map((item) => (
              <Fragment key={item.id}>
                <PostItem {...item} />
              </Fragment>
            ))
          )}
        </Fragment>
      )}
    </Grid>
  );
}
