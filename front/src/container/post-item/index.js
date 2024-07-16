import Box from "../../component/box";
import Grid from "../../component/grid";

import PostCreate from "../post-create";

import { Fragment, useState, useEffect, useReducer } from "react";
import PostContent from "../../component/post-content";
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
import { getDate } from "../../util/getDate";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

export default function Container({ id, username, text, date }) {
  const [state, dispatch] = useReducer(
    requestReducer,
    requestInitialState,
    //state за замовч в data отримує ті данні,
    //які нам приходять з пропсів
    (state) => ({ ...state, data: { id, username, date, text, reply: null } })
  );

  //для відкривання вікна з коментарями
  // для отримання данних
  const getData = async () => {
    dispatch({ type: REQUEST_ACTION_TYPE.PROGRESS });
    try {
      const res = await fetch(
        `http://localhost:4000/post-item?id=${state.data.id}`
      );

      const resData = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(resData),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: resData.message,
        });
      }
    } catch (error) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  };

  //або const convertData(raw) - тут уже через деструктур
  //витягуємо post

  const convertData = ({ post }) => ({
    id: post.id,
    username: post.username,
    text: post.text,
    date: getDate(post.date),

    reply: post.reply.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date: getDate(post.date),
    })),

    isEmpty: post.reply.length === 0,
  });

  //
  const [isOpen, setOpen] = useState(false);

  //щоб відкривати та закривати
  const handleOpen = () => {
    // if (status === null) {
    //   getData();
    // }

    setOpen(!isOpen);
  };

  // коли  isOpen, тобто коли відкриваються коментарі i
  //данні небули завантажені, (то в  alert(isOpen)),
  //то буде виконуватись оновлення(визиватися getData())
  useEffect(() => {
    if (isOpen === true) {
      // alert(isOpen);
      getData();
    }
  }, [isOpen]);

  return (
    <Box style={{ padding: "0" }}>
      <div
        style={{
          padding: "20px",
          cursor: "pointer",
        }}
        // відкривається вікно з кнопкою reply
        onClick={handleOpen}
      >
        <PostContent
          username={state.data.username}
          date={state.data.date}
          text={state.data.text}
        />
      </div>

      {isOpen && (
        <div style={{ padding: "0 20px 20px 20px" }}>
          <Grid>
            <Box className="post-item__inside-box">
              <PostCreate
                placeholder="Post your reply!"
                button="Reply"
                id={state.data.id}
                onCreate={getData}
              />
            </Box>

            {state.status === LOAD_STATUS.PROGRESS && (
              <Fragment>
                <Box>
                  <Skeleton />
                </Box>
                <Box>
                  <Skeleton />
                </Box>
              </Fragment>
            )}

            {state.status === LOAD_STATUS.ERROR && (
              <Alert status={state.status} message={state.message} />
            )}

            {state.status === LOAD_STATUS.SUCCESS &&
              state.data.isEmpty === false &&
              state.data.reply.map((item) => (
                <Fragment key={item.id}>
                  <Box>
                    <PostContent {...item} />
                  </Box>
                </Fragment>
              ))}
          </Grid>
        </div>
      )}
    </Box>
  );
}
