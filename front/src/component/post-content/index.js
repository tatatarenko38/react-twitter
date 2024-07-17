import { memo } from "react";

import "./index.css";

import Grid from "../grid";

//оптимізація через memo
function Component({ username, date, text }) {
  return (
    <Grid>
      <div className="post-content">
        <span className="post-content__username">@{username}</span>

        <span className="post-content__date">{date}</span>
      </div>

      <p className="post-content__text">{text}</p>
    </Grid>
  );
}
//react сам буде перевіряти кожний пропс({ username, date, text })
//якщо змінилися, тоді ререндер
export default memo(Component);
