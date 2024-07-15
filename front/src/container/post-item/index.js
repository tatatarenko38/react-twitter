import Box from "../../component/box";
import Grid from "../../component/grid";

import PostCreate from "../post-create";

import { Fragment, useState } from "react";
import PostContent from "../../component/post-content";
import { Alert, LOAD_STATUS, Skeleton } from "../../component/load";
import { getDate } from "../../util/getDate";

export default function Container({ id, username, text, date }) {
  const [data, setData] = useState({
    id,
    username,
    date,
    text,
    reply: null,
  });

  //
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  //для відкривання вікна з коментарями
  // для отримання данних
  const getData = async () => {
    setStatus(LOAD_STATUS.PROGRESS);
    try {
      const res = await fetch(`http://localhost:4000/post-item?id=${data.id}`);

      const resData = await res.json();

      if (res.ok) {
        setData(convertData(resData));
        setStatus(LOAD_STATUS.SUCCESS);
      } else {
        setMessage(resData.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (error) {
      setMessage(error.message);
      setStatus(LOAD_STATUS.ERROR);
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
    if (status === null) {
      getData();
    }

    setOpen(!isOpen);
  };

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
          username={data.username}
          date={data.date}
          text={data.text}
        />
      </div>

      {isOpen && (
        <div style={{ padding: "0 20px 20px 20px" }}>
          <Grid>
            <Box className="post-item__inside-box">
              <PostCreate
                placeholder="Post your reply!"
                button="Reply"
                id={data.id}
                onCreate={getData}
              />
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

            {status === LOAD_STATUS.ERROR &&
              (<Alert status={status} message={message} />)}

            {status === LOAD_STATUS.SUCCESS &&
              data.isEmpty === false &&
              data.reply.map((item) => (
                <Fragment key={item.id}>
                  <Box>
                    <PostContent {...item} />
                  </Box>
                </Fragment>
              ))
            }
          </Grid>
        </div>
      )}
    </Box>
  );
}
