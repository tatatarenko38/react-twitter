import Title from "../../component/title";
import Grid from "../../component/grid";
import Box from "../../component/box";

import PostCreate from "../post-create";
import { useState, Fragment } from "react";
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
import PostItem from "../post-item";

import { getDate } from "../../util/getDate";

export default function Container() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  //щоб тримати данні, які отримуємо з сервера
  const [data, setData] = useState(null);

  //завантажує список постів в контейнері post-list
  const getData = async () => {
    // перевірити чи спрацьовує onCreate
    // alert(true);

    //аналогічно як в post-create

    setStatus(LOAD_STATUS.PROGRESS);
    try {
      //робимо запит - за замовч завжди {method: "GET"}
      const res = await fetch("http://localhost:4000/post-list");

      //отримаємо данні
      const data = await res.json();

      if (res.ok) {
        //якщо є данні - кладемо в setData
        setData(convertData(data));
        setStatus(LOAD_STATUS.SUCCESS);
      } else {
        //якщо ромилка
        setMessage(data.message);
        setStatus(LOAD_STATUS.ERROR);
      }
      //якщо технічна помилка в коді
    } catch (error) {
      setMessage(error.message);
      setStatus(LOAD_STATUS.ERROR);
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

  if (status === null) {
    getData();
  }

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

      {status === LOAD_STATUS.PROGRESS && (
        <Fragment>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </Fragment>
      )}

      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}

      {/* список постів */}
      {status === LOAD_STATUS.SUCCESS && (
        <Fragment>
          {data.isEmpty ? (
            <Alert message="Список постів пустий" />
          ) : (
            data.list.map((item) => (
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
