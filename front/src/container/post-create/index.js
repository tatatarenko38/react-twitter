import { useState } from "react";

import "./index.css";

import FieldForm from "../../component/field-form";
import Grid from "../../component/grid";

import { Alert, Loader, LOAD_STATUS } from "../../component/load";

export default function Container({
  onCreate,
  placeholder,
  button,
  id = null,
}) {
  // для статусу
  const [status, setStatus] = useState(null);
  //для повідомлення помилки
  const [message, setMessage] = useState("");

  const handleSubmit = (value) => {
    return sendData({ value });
  };

  //логіка відправки данних
  //dataToSend це { value }
  // заімпортувати потрібні компоненти з компонента load

  const sendData = async (dataToSend) => {
    //показати що починається завантаження нашого запиту на сервер
    setStatus(LOAD_STATUS.PROGRESS);

    try {
      const res = await fetch("http://localhost:4000/post-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: convertData(dataToSend),
      });

      //

      const data = await res.json();

      // якщо запит успішний - далі не потрібно
      //ставити success - треба просто відкатитися до
      //статусу за замовч = null- де ми взагалі ще нічого
      //не робили
      if (res.ok) {
        setStatus(null);

        //буде виконуватись пропс onCreate(приходить з post-list),
        // який містить getData - завантажує список постів
        // тобто якщо пост створений, то список постів
        //буде оновлюватись і ми будем бачити наш
        //новий пост
        if (onCreate) onCreate();
      } else {
        //якщо помилка
        setMessage(data.message);
        setStatus(LOAD_STATUS.ERROR);
      }
    } catch (error) {
      //спочатку повідомлення!
      setMessage(error.message);
      setStatus(LOAD_STATUS.ERROR);
    }
  };

  const convertData = ({ value }) =>
    JSON.stringify({
      text: value,
      username: "user",
      postId: id,
    });

  return (
    <Grid>
      <FieldForm
        placeholder={placeholder}
        button={button}
        onSubmit={handleSubmit}
      />

      {status === LOAD_STATUS.ERROR && (
        <Alert status={status} message={message} />
      )}

      {status === LOAD_STATUS.PROGRESS && <Loader />}
    </Grid>
  );
}
